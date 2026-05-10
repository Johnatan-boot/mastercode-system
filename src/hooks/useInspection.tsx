import { useState, useCallback } from 'react';
import React from 'react';
import { AlertTriangle, Activity } from 'lucide-react';

export interface InspectionReport {
  score: number;
  security: number;
  performance: number;
  maintainability: number;
  issues: {
    type: string;
    text: string;
    icon: React.ReactNode;
  }[];
}

export function useInspection() {
  const [isScanning, setIsScanning] = useState(false);
  const [report, setReport] = useState<InspectionReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanCode = useCallback(async (codeSnippet: string) => {
    if (!codeSnippet.trim()) return;
    
    setIsScanning(true);
    setReport(null);
    setError(null);
    
    try {
      // In the real system the token key is 'mastercode_token' from useAuth
      const token = localStorage.getItem('mastercode_token');
      const res = await fetch('/api/inspector/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ codeSnippet })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze code.');
      }

      setReport({
        score: data.score.totalScore,
        security: data.score.securityScore,
        performance: data.score.performanceScore,
        maintainability: data.score.maintainabilityScore,
        issues: data.issues.map((iss: any) => ({
          type: iss.severity,
          text: iss.description,
          icon: iss.severity === 'critical' ? <AlertTriangle size={16} className="text-red-500" /> : <Activity size={16} className="text-yellow-500" />
        }))
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro de conexão com o Inspector Core.');
    } finally {
      setIsScanning(false);
    }
  }, []);

  return { scanCode, isScanning, report, error, clearReport: () => setReport(null) };
}
