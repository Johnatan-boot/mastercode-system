import { Report } from '../entities/Report';
import { Issue } from '../entities/Issue';

export interface IReportRepository {
  saveReport(report: Report): Promise<void>;
  saveIssues(issues: Issue[]): Promise<void>;
  findReportByInspectionId(inspectionId: string): Promise<Report | null>;
  findIssuesByReportId(reportId: string): Promise<Issue[]>;
}
