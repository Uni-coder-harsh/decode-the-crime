import { useState, useCallback } from 'react';
import { judgeService } from '@/services/judgeService';

interface UseJudgeResult {
  isSubmitting: boolean;
  lastResult: any;
  submitCode: (code: string, language: string, testCases: any[]) => Promise<any>;
  validateCode: (code: string, language: string) => { valid: boolean; errors: string[] };
  getSupportedLanguages: () => string[];
}

export const useJudge = (): UseJudgeResult => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const submitCode = useCallback(async (code: string, language: string, testCases: any[]) => {
    setIsSubmitting(true);
    
    try {
      const submission = {
        code,
        language,
        testCases,
        timeLimit: 5, // 5 seconds
        memoryLimit: 128 // 128MB
      };

      // Validate submission first
      const validation = judgeService.validateSubmission(submission);
      if (!validation.valid) {
        const result = {
          success: false,
          score: 0,
          message: validation.errors.join(', '),
          compilationError: validation.errors.join(', ')
        };
        setLastResult(result);
        return result;
      }

      // Submit to judge service
      const result = await judgeService.submitCode(submission);
      setLastResult(result);
      return result;
    } catch (error) {
      const errorResult = {
        success: false,
        score: 0,
        message: 'Submission failed',
        runtimeError: error instanceof Error ? error.message : 'Unknown error'
      };
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const validateCode = useCallback((code: string, language: string) => {
    return judgeService.validateSubmission({
      code,
      language,
      testCases: [],
      timeLimit: 5,
      memoryLimit: 128
    });
  }, []);

  const getSupportedLanguages = useCallback(() => {
    return judgeService.getSupportedLanguages();
  }, []);

  return {
    isSubmitting,
    lastResult,
    submitCode,
    validateCode,
    getSupportedLanguages
  };
};