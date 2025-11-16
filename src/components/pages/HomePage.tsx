import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Terminal, Zap, Code, Play, Copy, Download } from 'lucide-react';
import { jdoodleService } from '@/services/jdoodleService';

export default function HomePage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [error, setError] = useState('');
  
  // Code editor states
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);

  useEffect(() => {
    // Load JDoodle embed script
    const script = document.createElement('script');
    script.src = 'https://www.jdoodle.com/assets/jdoodle-pym.min.js';
    script.async = true;
    document.head.appendChild(script);

    // Set initial code template
    setCode(jdoodleService.getCodeTemplate(selectedLanguage));

    return () => {
      // Cleanup script
      const existingScript = document.querySelector('script[src="https://www.jdoodle.com/assets/jdoodle-pym.min.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  useEffect(() => {
    // Update code template when language changes
    setCode(jdoodleService.getCodeTemplate(selectedLanguage));
    setOutput('');
    setExecutionResult(null);
  }, [selectedLanguage]);

  const handleStart = () => {
    setShowLogin(true);
    setUsername('');
    setPassword('');
    setShowPasswordField(false);
    setError('');
  };

  const handleUsernameSubmit = () => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    // Store username for use throughout the app
    localStorage.setItem('playerUsername', username.trim());

    if (username === 'Admin@123#') {
      setShowPasswordField(true);
      setError('');
    } else {
      // Regular participant - go to lobby
      setShowLogin(false);
      navigate('/lobby');
    }
  };

  const handlePasswordSubmit = () => {
    if (password === 'pass@123') {
      setShowLogin(false);
      navigate('/admin');
    } else {
      setError('Invalid password');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showPasswordField) {
        handlePasswordSubmit();
      } else {
        handleUsernameSubmit();
      }
    }
  };

  const executeCode = async () => {
    if (!code.trim()) {
      setOutput('Error: Please enter some code to execute');
      return;
    }

    setIsExecuting(true);
    setOutput('Executing code...');
    
    try {
      const result = await jdoodleService.executeCode({
        code: code,
        language: selectedLanguage,
        testCases: []
      });

      setExecutionResult(result);
      
      if (result.success) {
        setOutput(result.output || 'Code executed successfully');
      } else {
        setOutput(`Error: ${result.error || result.message}`);
      }
    } catch (error) {
      setOutput(`Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const downloadCode = () => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c'
    };
    
    const extension = extensions[selectedLanguage as keyof typeof extensions] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-dark-bg matrix-bg">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-6xl md:text-8xl font-bold text-neon-green neon-text glitch mb-4"
            data-text="DECODE WARS"
          >
            DECODE WARS
          </h1>
          <p className="text-xl md:text-2xl text-neon-blue mb-8">
            Enter the Matrix of Code Challenges
          </p>
        </div>

        <Tabs defaultValue="playground" className="space-y-6">
          <TabsList className="bg-dark-card border border-neon-green/30 mx-auto">
            <TabsTrigger value="playground" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">
              <Code className="w-4 h-4 mr-2" />
              Code Playground
            </TabsTrigger>
            <TabsTrigger value="features" className="data-[state=active]:bg-neon-blue data-[state=active]:text-black">
              <Terminal className="w-4 h-4 mr-2" />
              Features
            </TabsTrigger>
          </TabsList>

          {/* Code Playground Tab */}
          <TabsContent value="playground" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Code Editor Section */}
              <Card className="bg-dark-card border-neon-green/30">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-neon-green flex items-center">
                      <Terminal className="w-5 h-5 mr-2" />
                      Interactive Code Editor
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyCode}
                        variant="outline"
                        size="sm"
                        className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={downloadCode}
                        variant="outline"
                        size="sm"
                        className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Language Selector */}
                  <div className="flex items-center gap-4">
                    <label className="text-neon-blue font-medium">Language:</label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-48 bg-dark-bg border-neon-green/50 text-neon-green">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-dark-card border-neon-green/50">
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="c">C</SelectItem>
                        <SelectItem value="csharp">C#</SelectItem>
                        <SelectItem value="go">Go</SelectItem>
                        <SelectItem value="rust">Rust</SelectItem>
                        <SelectItem value="php">PHP</SelectItem>
                        <SelectItem value="ruby">Ruby</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Code Editor */}
                  <div className="space-y-2">
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-80 p-4 bg-dark-bg border border-neon-green/50 rounded-lg text-neon-green font-mono text-sm resize-none focus:border-neon-green focus:outline-none"
                      placeholder="Write your code here..."
                      spellCheck={false}
                    />
                  </div>

                  {/* Execute Button */}
                  <Button
                    onClick={executeCode}
                    disabled={isExecuting}
                    className="w-full bg-neon-green text-black hover:bg-neon-green/80 neon-glow"
                  >
                    {isExecuting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run Code
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Output Section */}
              <Card className="bg-dark-card border-neon-blue/30">
                <CardHeader>
                  <CardTitle className="text-neon-blue flex items-center">
                    <Terminal className="w-5 h-5 mr-2" />
                    Output Console
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-dark-bg border border-neon-blue/50 rounded-lg p-4 h-80 overflow-y-auto">
                    <pre className="text-neon-green font-mono text-sm whitespace-pre-wrap">
                      {output || 'Output will appear here after running your code...'}
                    </pre>
                    
                    {executionResult && (
                      <div className="mt-4 pt-4 border-t border-neon-blue/30">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-2 h-2 rounded-full ${executionResult.success ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className="text-sm text-gray-400">
                            Status: {executionResult.success ? 'Success' : 'Failed'}
                          </span>
                        </div>
                        {executionResult.executionTime && (
                          <div className="text-xs text-gray-500">
                            Execution Time: {executionResult.executionTime}
                          </div>
                        )}
                        {executionResult.memory && (
                          <div className="text-xs text-gray-500">
                            Memory Used: {executionResult.memory}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* JDoodle Embed Section */}
            <Card className="bg-dark-card border-neon-purple/30">
              <CardHeader>
                <CardTitle className="text-neon-purple flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Advanced JDoodle Editor
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  Full-featured online IDE with syntax highlighting, auto-completion, and debugging
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-dark-bg border border-neon-purple/50 rounded-lg overflow-hidden">
                  {/* JDoodle Embed */}
                  <div 
                    data-pym-src="https://www.jdoodle.com/embed/v0/6Bqr?stdin=0&arg=0&rw=1"
                    className="min-h-[500px] w-full"
                    style={{ minHeight: '500px' }}
                  >
                    <div className="flex items-center justify-center h-96 text-gray-400">
                      <div className="text-center">
                        <Terminal className="w-12 h-12 mx-auto mb-4 text-neon-purple" />
                        <p>Loading JDoodle Editor...</p>
                        <p className="text-sm mt-2">Advanced IDE with full language support</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-dark-card border-neon-green/30 hover:border-neon-green transition-all duration-300 hover:neon-glow">
                <CardHeader>
                  <Terminal className="w-12 h-12 text-neon-green mx-auto mb-2" />
                  <CardTitle className="text-neon-green">Code Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Solve complex programming puzzles and algorithmic challenges
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-dark-card border-neon-blue/30 hover:border-neon-blue transition-all duration-300 hover:neon-glow">
                <CardHeader>
                  <Zap className="w-12 h-12 text-neon-blue mx-auto mb-2" />
                  <CardTitle className="text-neon-blue">Real-time Battles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Compete against other hackers in live coding competitions
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-dark-card border-neon-purple/30 hover:border-neon-purple transition-all duration-300 hover:neon-glow">
                <CardHeader>
                  <Shield className="w-12 h-12 text-neon-purple mx-auto mb-2" />
                  <CardTitle className="text-neon-purple">Detective Mode</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Uncover mysteries through logical reasoning and deduction
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <Button 
                onClick={handleStart}
                className="bg-neon-green text-black hover:bg-neon-green/80 text-2xl px-12 py-6 rounded-lg neon-glow font-bold transition-all duration-300 hover:scale-105"
              >
                INITIATE SEQUENCE
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Login Dialog */}
        <Dialog open={showLogin} onOpenChange={setShowLogin}>
          <DialogContent className="bg-dark-card border-neon-green text-neon-green max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl neon-text">
                {showPasswordField ? 'ADMIN ACCESS' : 'IDENTITY VERIFICATION'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 p-4">
              {!showPasswordField ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-neon-blue">
                      USERNAME
                    </label>
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your handle..."
                      className="bg-dark-bg border-neon-green/50 text-neon-green placeholder-gray-500 focus:border-neon-green"
                      autoFocus
                    />
                  </div>
                  <Button 
                    onClick={handleUsernameSubmit}
                    className="w-full bg-neon-green text-black hover:bg-neon-green/80 neon-glow"
                  >
                    AUTHENTICATE
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-neon-purple">
                      ADMIN PASSWORD
                    </label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter admin key..."
                      className="bg-dark-bg border-neon-purple/50 text-neon-green placeholder-gray-500 focus:border-neon-purple"
                      autoFocus
                    />
                  </div>
                  <Button 
                    onClick={handlePasswordSubmit}
                    className="w-full bg-neon-purple text-white hover:bg-neon-purple/80 neon-glow"
                  >
                    ACCESS GRANTED
                  </Button>
                </>
              )}
              
              {error && (
                <p className="text-destructive text-center text-sm neon-text">
                  {error}
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}