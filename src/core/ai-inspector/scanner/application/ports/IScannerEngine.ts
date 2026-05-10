export interface IScannerEngine {
  analyzeCode(codeSnippet: string): Promise<{
    score: number;
    security: number;
    performance: number;
    architecture: number;
    maintainability: number;
    summary: string;
    rawIssues: Array<{
      category: string;
      severity: string;
      title: string;
      description: string;
    }>;
  }>;
}
