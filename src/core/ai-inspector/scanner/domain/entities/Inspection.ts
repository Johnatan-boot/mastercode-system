export type InspectionStatus = 'queued' | 'running' | 'completed' | 'failed';

export class Inspection {
  constructor(
    public readonly id: string,
    public readonly jobId: string,
    public readonly requestedBy: string, // User ID (IAM)
    public readonly engineId: string,
    public status: InspectionStatus = 'queued',
    public repositoryId?: string,
    public commitHash?: string,
    public targetBranch?: string,
    public filesScanned: number = 0,
    public startedAt?: Date,
    public completedAt?: Date
  ) {}

  public markAsRunning(): void {
    this.status = 'running';
    this.startedAt = new Date();
  }

  public markAsCompleted(filesScanned: number): void {
    this.status = 'completed';
    this.filesScanned = filesScanned;
    this.completedAt = new Date();
  }

  public markAsFailed(): void {
    this.status = 'failed';
    this.completedAt = new Date();
  }
}
