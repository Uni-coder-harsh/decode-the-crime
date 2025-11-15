// Judge0 API service for code execution
// This is a mock implementation since we don't have access to the actual Judge0 API

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface SubmissionResult {
  success: boolean;
  score: number;
  message: string;
  testResults?: Array<{
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    executionTime: number;
  }>;
  compilationError?: string;
  runtimeError?: string;
}

interface CodeSubmission {
  code: string;
  language: string;
  testCases: TestCase[];
  timeLimit: number;
  memoryLimit: number;
}

class JudgeService {
  private readonly API_URL = 'https://api.judge0.com';
  private readonly API_KEY = process.env.JUDGE0_API_KEY || 'mock-key';

  // Language IDs for Judge0
  private readonly LANGUAGE_IDS = {
    javascript: 63,
    python: 71,
    java: 62,
    cpp: 54,
    c: 50,
    csharp: 51,
    go: 60,
    rust: 73,
    kotlin: 78,
    swift: 83
  };

  async submitCode(submission: CodeSubmission): Promise<SubmissionResult> {
    try {
      // Mock implementation - in real app, this would call Judge0 API
      return this.mockJudgeExecution(submission);
    } catch (error) {
      console.error('Judge service error:', error);
      return {
        success: false,
        score: 0,
        message: 'Execution service temporarily unavailable',
        compilationError: 'Service error'
      };
    }
  }

  private async mockJudgeExecution(submission: CodeSubmission): Promise<SubmissionResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const { code, testCases } = submission;

    // Mock compilation check
    if (this.hasCompilationError(code)) {
      return {
        success: false,
        score: 0,
        message: 'Compilation Error',
        compilationError: 'Syntax error in your code'
      };
    }

    // Mock runtime error check
    if (this.hasRuntimeError(code)) {
      return {
        success: false,
        score: 0,
        message: 'Runtime Error',
        runtimeError: 'Your code threw an exception during execution'
      };
    }

    // Mock test case execution
    const testResults = testCases.map((testCase, index) => {
      const passed = this.mockTestExecution(code, testCase);
      return {
        passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: passed ? testCase.expectedOutput : 'Wrong output',
        executionTime: Math.random() * 100 + 10 // 10-110ms
      };
    });

    const passedTests = testResults.filter(result => result.passed).length;
    const totalTests = testResults.length;
    const success = passedTests === totalTests;
    const score = Math.round((passedTests / totalTests) * 100);

    return {
      success,
      score,
      message: success 
        ? `All tests passed! (${passedTests}/${totalTests})`
        : `${passedTests}/${totalTests} tests passed`,
      testResults
    };
  }

  private hasCompilationError(code: string): boolean {
    // Simple mock compilation error detection
    const errorPatterns = [
      /function\s+\w+\s*\(\s*\)\s*{[^}]*$/,  // Unclosed function
      /\bif\s*\([^)]*\)\s*{[^}]*$/,          // Unclosed if statement
      /\bfor\s*\([^)]*\)\s*{[^}]*$/,         // Unclosed for loop
    ];
    
    return errorPatterns.some(pattern => pattern.test(code)) && Math.random() < 0.1;
  }

  private hasRuntimeError(code: string): boolean {
    // Simple mock runtime error detection
    const errorPatterns = [
      /\.length\s*-\s*1\s*\]/,  // Potential array index error
      /\/\s*0/,                 // Division by zero
      /null\./,                 // Null reference
    ];
    
    return errorPatterns.some(pattern => pattern.test(code)) && Math.random() < 0.05;
  }

  private mockTestExecution(code: string, testCase: TestCase): boolean {
    // Mock test execution logic
    // In a real implementation, this would execute the code with the test input
    
    // Simple heuristics for common problems
    if (testCase.input.includes('nums') && testCase.expectedOutput.includes('[')) {
      // Two Sum problem
      return code.includes('map') || code.includes('Map') || 
             (code.includes('for') && code.includes('return'));
    }
    
    if (testCase.input.includes('target') && code.includes('binary')) {
      // Binary search problem
      return code.includes('while') && code.includes('mid');
    }
    
    // Default: 70% success rate for demonstration
    return Math.random() > 0.3;
  }

  // Get supported languages
  getSupportedLanguages() {
    return Object.keys(this.LANGUAGE_IDS);
  }

  // Get language ID for Judge0
  getLanguageId(language: string): number {
    return this.LANGUAGE_IDS[language as keyof typeof this.LANGUAGE_IDS] || 63; // Default to JavaScript
  }

  // Validate code submission
  validateSubmission(submission: CodeSubmission): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!submission.code.trim()) {
      errors.push('Code cannot be empty');
    }

    if (submission.code.length > 50000) {
      errors.push('Code is too long (max 50,000 characters)');
    }

    if (!submission.language || !this.getSupportedLanguages().includes(submission.language)) {
      errors.push('Unsupported programming language');
    }

    if (!submission.testCases || submission.testCases.length === 0) {
      errors.push('No test cases provided');
    }

    if (submission.timeLimit && (submission.timeLimit < 1 || submission.timeLimit > 30)) {
      errors.push('Time limit must be between 1 and 30 seconds');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Create test cases for common problems
  createTestCases(problemType: string): TestCase[] {
    switch (problemType) {
      case 'two-sum':
        return [
          {
            input: 'nums = [2,7,11,15], target = 9',
            expectedOutput: '[0,1]'
          },
          {
            input: 'nums = [3,2,4], target = 6',
            expectedOutput: '[1,2]'
          },
          {
            input: 'nums = [3,3], target = 6',
            expectedOutput: '[0,1]'
          }
        ];
      
      case 'binary-search':
        return [
          {
            input: 'nums = [-1,0,3,5,9,12], target = 9',
            expectedOutput: '4'
          },
          {
            input: 'nums = [-1,0,3,5,9,12], target = 2',
            expectedOutput: '-1'
          }
        ];
      
      case 'palindrome':
        return [
          {
            input: 's = "A man, a plan, a canal: Panama"',
            expectedOutput: 'true'
          },
          {
            input: 's = "race a car"',
            expectedOutput: 'false'
          }
        ];
      
      default:
        return [
          {
            input: 'test input',
            expectedOutput: 'expected output'
          }
        ];
    }
  }
}

// Export singleton instance
export const judgeService = new JudgeService();