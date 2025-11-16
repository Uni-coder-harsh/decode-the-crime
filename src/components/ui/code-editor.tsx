import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { jdoodleService, ExecutionResult, CodeSubmission } from '@/services/jdoodleService';
import { 
  Play, 
  Square, 
  Code, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  HardDrive,
  AlertTriangle,
  Lightbulb,
  Download,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TestCase {
  input: string;
  expectedOutput: string;
}

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  testCases?: TestCase[];
  onSubmit?: (result: ExecutionResult) => void;
  onCodeChange?: (code: string) => void;
  readOnly?: boolean;
  showTestCases?: boolean;
  problemType?: string;
}

export function CodeEditor({
  initialCode = '',
  language = 'javascript',
  testCases = [],
  onSubmit,
  onCodeChange,
  readOnly = false,
  showTestCases = true,
  problemType = 'general'
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [credits, setCredits] = useState<number | null>(null);

  // Load code template when language changes
  useEffect(() => {
    if (!code.trim() || code === initialCode) {
      const template = jdoodleService.getCodeTemplate(selectedLanguage);
      setCode(template);
      onCodeChange?.(template);
    }
  }, [selectedLanguage]);

  // Check JDoodle credits on mount
  useEffect(() => {
    checkCredits();
  }, []);

  const checkCredits = async () => {
    try {
      const usedCredits = await jdoodleService.checkCredits();
      setCredits(usedCredits);
    } catch (error) {
      console.warn('Could not check credits:', error);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
  };

  const executeCode = async () => {
    if (!code.trim()) {
      setExecutionResult({
        success: false,
        score: 0,
        message: 'Code cannot be empty',
        error: 'Please write some code before executing'
      });
      return;
    }

    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const submission: CodeSubmission = {
        code,
        language: selectedLanguage,
        testCases: showTestCases ? testCases : [],
        timeLimit: 10
      };

      const result = await jdoodleService.executeCode(submission);
      setExecutionResult(result);
      onSubmit?.(result);
      
      // Update credits after execution
      await checkCredits();
    } catch (error) {
      setExecutionResult({
        success: false,
        score: 0,
        message: 'Execution failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const loadTemplate = () => {
    const template = jdoodleService.getCodeTemplate(selectedLanguage);
    setCode(template);
    onCodeChange?.(template);
  };

  const loadTestCases = () => {
    const generatedTestCases = jdoodleService.createTestCases(problemType);
    // This would typically update the parent component's test cases
    console.log('Generated test cases:', generatedTestCases);
  };

  const getResultIcon = (result: ExecutionResult) => {
    if (result.success) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (result.compilationError) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getResultColor = (result: ExecutionResult) => {
    if (result.success) return 'border-green-500 bg-green-500/10';
    if (result.compilationError) return 'border-red-500 bg-red-500/10';
    return 'border-yellow-500 bg-yellow-500/10';
  };

  return (
    <div className="space-y-4">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Code className="h-5 w-5 text-neon-green" />
            <span className="font-heading font-semibold text-neon-green">Code Editor</span>
          </div>
          
          <Select value={selectedLanguage} onValueChange={handleLanguageChange} disabled={readOnly}>
            <SelectTrigger className="w-40 bg-dark-bg border-neon-green/50 text-neon-green">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {jdoodleService.getSupportedLanguages().map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          {credits !== null && (
            <Badge variant="outline" className="border-neon-blue text-neon-blue">
              Credits: {credits}
            </Badge>
          )}
          
          <Button
            onClick={loadTemplate}
            variant="outline"
            size="sm"
            disabled={readOnly}
            className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black"
          >
            <FileText className="h-4 w-4 mr-1" />
            Template
          </Button>
          
          <Button
            onClick={executeCode}
            disabled={isExecuting || readOnly}
            className="bg-neon-green text-black hover:bg-neon-green/80"
          >
            {isExecuting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Code
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-dark-card border border-neon-green/30">
          <TabsTrigger value="editor" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">
            Editor
          </TabsTrigger>
          {showTestCases && (
            <TabsTrigger value="tests" className="data-[state=active]:bg-neon-blue data-[state=active]:text-black">
              Test Cases
            </TabsTrigger>
          )}
          <TabsTrigger value="output" className="data-[state=active]:bg-neon-purple data-[state=active]:text-black">
            Output
          </TabsTrigger>
        </TabsList>

        {/* Code Editor Tab */}
        <TabsContent value="editor" className="space-y-4">
          <Card className="bg-dark-card border-neon-green/30">
            <CardContent className="p-4">
              <Textarea
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Write your code here..."
                className="min-h-[400px] font-mono text-sm bg-dark-bg border-neon-green/50 text-neon-green resize-none"
                disabled={readOnly}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Cases Tab */}
        {showTestCases && (
          <TabsContent value="tests" className="space-y-4">
            <Card className="bg-dark-card border-neon-blue/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-neon-blue">Test Cases</CardTitle>
                  <Button
                    onClick={loadTestCases}
                    variant="outline"
                    size="sm"
                    className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black"
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Generate
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {testCases.length > 0 ? (
                  testCases.map((testCase, index) => (
                    <div key={index} className="p-4 bg-dark-bg rounded border border-neon-blue/20">
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-semibold text-neon-blue">Input:</span>
                          <pre className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{testCase.input}</pre>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-neon-green">Expected Output:</span>
                          <pre className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{testCase.expectedOutput}</pre>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No test cases available</p>
                    <p className="text-sm">Click "Generate" to create test cases for common problems</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Output Tab */}
        <TabsContent value="output" className="space-y-4">
          <Card className="bg-dark-card border-neon-purple/30">
            <CardHeader>
              <CardTitle className="text-neon-purple">Execution Results</CardTitle>
            </CardHeader>
            <CardContent>
              {executionResult ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Result Summary */}
                  <div className={`p-4 rounded border ${getResultColor(executionResult)}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {getResultIcon(executionResult)}
                      <span className="font-semibold">{executionResult.message}</span>
                      {executionResult.score !== undefined && (
                        <Badge variant="outline" className="ml-auto">
                          Score: {executionResult.score}%
                        </Badge>
                      )}
                    </div>
                    
                    {/* Execution Metrics */}
                    {(executionResult.executionTime || executionResult.memory) && (
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        {executionResult.executionTime && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{executionResult.executionTime}</span>
                          </div>
                        )}
                        {executionResult.memory && (
                          <div className="flex items-center space-x-1">
                            <HardDrive className="h-4 w-4" />
                            <span>{executionResult.memory}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Output */}
                  {executionResult.output && (
                    <div>
                      <h4 className="font-semibold text-neon-green mb-2">Output:</h4>
                      <pre className="p-3 bg-dark-bg rounded border border-neon-green/20 text-sm text-gray-300 whitespace-pre-wrap">
                        {executionResult.output}
                      </pre>
                    </div>
                  )}

                  {/* Compilation Error */}
                  {executionResult.compilationError && (
                    <div>
                      <h4 className="font-semibold text-red-500 mb-2">Compilation Error:</h4>
                      <pre className="p-3 bg-red-900/20 rounded border border-red-500/30 text-sm text-red-300 whitespace-pre-wrap">
                        {executionResult.compilationError}
                      </pre>
                    </div>
                  )}

                  {/* Runtime Error */}
                  {executionResult.runtimeError && (
                    <div>
                      <h4 className="font-semibold text-yellow-500 mb-2">Runtime Error:</h4>
                      <pre className="p-3 bg-yellow-900/20 rounded border border-yellow-500/30 text-sm text-yellow-300 whitespace-pre-wrap">
                        {executionResult.runtimeError}
                      </pre>
                    </div>
                  )}

                  {/* Test Results */}
                  {executionResult.testResults && executionResult.testResults.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-neon-blue mb-3">Test Results:</h4>
                      <div className="space-y-3">
                        {executionResult.testResults.map((result, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded border ${
                              result.passed 
                                ? 'border-green-500/30 bg-green-500/10' 
                                : 'border-red-500/30 bg-red-500/10'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {result.passed ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className="font-semibold">Test Case {index + 1}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-gray-400">
                                <Clock className="h-3 w-3" />
                                <span>{result.executionTime}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                              <div>
                                <span className="font-semibold text-neon-blue">Input:</span>
                                <pre className="text-gray-300 mt-1">{result.input}</pre>
                              </div>
                              <div>
                                <span className="font-semibold text-neon-green">Expected:</span>
                                <pre className="text-gray-300 mt-1">{result.expectedOutput}</pre>
                              </div>
                              <div>
                                <span className="font-semibold text-neon-purple">Actual:</span>
                                <pre className={`mt-1 ${result.passed ? 'text-green-300' : 'text-red-300'}`}>
                                  {result.actualOutput}
                                </pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {executionResult.error && (
                    <div>
                      <h4 className="font-semibold text-red-500 mb-2">Error:</h4>
                      <pre className="p-3 bg-red-900/20 rounded border border-red-500/30 text-sm text-red-300 whitespace-pre-wrap">
                        {executionResult.error}
                      </pre>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No execution results yet</p>
                  <p className="text-sm">Click "Run Code" to execute your solution</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}