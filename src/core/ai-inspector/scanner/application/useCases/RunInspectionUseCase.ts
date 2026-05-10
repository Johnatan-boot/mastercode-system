import { IInspectionRepository } from '../../domain/repositories/IInspectionRepository';
import { Inspection } from '../../domain/entities/Inspection';
import { IScannerEngine } from '../ports/IScannerEngine';
import { IReportRepository } from '../../../reporting/domain/repositories/IReportRepository';
import { Report } from '../../../reporting/domain/entities/Report';
import { Issue, IssueCategory, IssueSeverity } from '../../../reporting/domain/entities/Issue';

export interface RunInspectionCommand {
  userId: string;
  codeSnippet: string;
}

export class RunInspectionUseCase {
  constructor(
    private readonly inspectionRepository: IInspectionRepository,
    private readonly reportRepository: IReportRepository,
    private readonly scannerEngine: IScannerEngine
  ) {}

  async execute(cmd: RunInspectionCommand): Promise<{ inspection: Inspection; report: Report; issues: Issue[] }> {
    const inspectionId = `insp-${Date.now()}`;
    const jobId = `job-${Date.now()}`;
    const engineId = 'engine-mock-v1';

    // 1. Criar Inspeção (Bounded Context: Scanner)
    const inspection = new Inspection(inspectionId, jobId, cmd.userId, engineId);
    await this.inspectionRepository.save(inspection);

    try {
      inspection.markAsRunning();
      await this.inspectionRepository.update(inspection);

      // 2. Chamar Motor LLM (Port/Adapter)
      const scanResult = await this.scannerEngine.analyzeCode(cmd.codeSnippet);

      // 3. Montar Relatório (Bounded Context: Reporting)
      const reportId = `rep-${Date.now()}`;
      const report = new Report(
        reportId,
        inspectionId,
        scanResult.score,
        scanResult.security,
        scanResult.performance,
        scanResult.architecture,
        scanResult.maintainability,
        scanResult.summary
      );
      await this.reportRepository.saveReport(report);

      // 4. Montar Issues
      const issues = scanResult.rawIssues.map((raw, index) => new Issue(
        `iss-${Date.now()}-${index}`,
        reportId,
        raw.category as IssueCategory,
        raw.severity as IssueSeverity,
        raw.title,
        raw.description
      ));
      await this.reportRepository.saveIssues(issues);

      // 5. Finalizar Inspeção
      inspection.markAsCompleted(1); // 1 "arquivo" (snippet) analisado
      await this.inspectionRepository.update(inspection);

      return { inspection, report, issues };
    } catch (error) {
      inspection.markAsFailed();
      await this.inspectionRepository.update(inspection);
      throw new Error(`Falha na inspeção estrutural: ${(error as Error).message}`);
    }
  }
}
