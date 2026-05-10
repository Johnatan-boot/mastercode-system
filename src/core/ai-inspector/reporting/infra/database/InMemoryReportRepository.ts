import { IReportRepository } from '../../domain/repositories/IReportRepository';
import { Report } from '../../domain/entities/Report';
import { Issue } from '../../domain/entities/Issue';

export class InMemoryReportRepository implements IReportRepository {
  private reports: Report[] = [];
  private issues: Issue[] = [];

  async saveReport(report: Report): Promise<void> {
    this.reports.push(report);
  }

  async saveIssues(issues: Issue[]): Promise<void> {
    this.issues.push(...issues);
  }

  async findReportByInspectionId(inspectionId: string): Promise<Report | null> {
    const report = this.reports.find(r => r.inspectionId === inspectionId);
    return report || null;
  }

  async findIssuesByReportId(reportId: string): Promise<Issue[]> {
    return this.issues.filter(i => i.reportId === reportId);
  }
}
