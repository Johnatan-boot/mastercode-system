export type IssueSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';
export type IssueCategory = 'security' | 'performance' | 'architecture' | 'maintainability';
export type IssueStatus = 'open' | 'resolved' | 'ignored';

export class Issue {
  constructor(
    public readonly id: string,
    public readonly reportId: string,
    public readonly category: IssueCategory,
    public readonly severity: IssueSeverity,
    public readonly title: string,
    public readonly description: string,
    public status: IssueStatus = 'open',
    public filePath?: string,
    public lineNumber?: number,
    public suggestionCode?: string,
    public resolvedAt?: Date,
    public readonly createdAt: Date = new Date()
  ) {}

  public markAsResolved(): void {
    this.status = 'resolved';
    this.resolvedAt = new Date();
  }
}
