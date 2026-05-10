export type JobStatus = 'queued' | 'running' | 'completed' | 'failed';

export class Job {
  constructor(
    public readonly id: string,
    public payload: Record<string, any>,
    public status: JobStatus = 'queued',
    public retryCount: number = 0,
    public startedAt?: Date,
    public completedAt?: Date,
    public readonly createdAt: Date = new Date()
  ) {}

  public markAsRunning(): void {
    this.status = 'running';
    this.startedAt = new Date();
  }

  public markAsCompleted(): void {
    this.status = 'completed';
    this.completedAt = new Date();
  }

  public markAsFailed(): void {
    this.status = 'failed';
    this.completedAt = new Date();
  }
}
