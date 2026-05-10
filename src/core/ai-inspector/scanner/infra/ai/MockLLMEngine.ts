import { IScannerEngine } from '../../application/ports/IScannerEngine';

// Adaptador Infra-estrutura: LLM Service Mock
export class MockLLMEngine implements IScannerEngine {
  async analyzeCode(codeSnippet: string) {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          score: 72,
          security: 80,
          performance: 65,
          architecture: 75,
          maintainability: 70,
          summary: "O código possui boa legibilidade, porém acopla a camada de banco de dados e sugere brechas de injeção em determinados blocos.",
          rawIssues: [
            {
              category: 'security',
              severity: 'critical',
              title: 'Possível SQL Injection',
              description: 'Evite concatenação bruta de strings em queries. Utilize prepared statements.'
            },
            {
              category: 'architecture',
              severity: 'medium',
              title: 'Acoplamento Elevado',
              description: 'Aclasse acessa o banco de dados diretamente, violando o princípio SRP (Separation of Concerns).'
            }
          ]
        });
      }, 1500);
    });
  }
}
