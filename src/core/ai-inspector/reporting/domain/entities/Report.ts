export class Report {
  constructor(
    public readonly id: string,
    public readonly inspectionId: string,
    public readonly totalScore: number,
    public readonly securityScore: number,
    public readonly performanceScore: number,
    public readonly architectureScore: number,
    public readonly maintainabilityScore: number,
    public readonly aiSummary?: string,
    public readonly generatedAt: Date = new Date()
  ) {
    if (totalScore < 0 || totalScore > 100) {
      throw new Error("Total score must be between 0 and 100");
    }
  }
}
