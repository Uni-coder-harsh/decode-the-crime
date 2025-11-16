import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, Terminal, Zap } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-dark-bg matrix-bg flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Title */}
        <div className="mb-12">
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
        <Button 
          onClick={handleStart}
          className="bg-neon-green text-black hover:bg-neon-green/80 text-2xl px-12 py-6 rounded-lg neon-glow font-bold transition-all duration-300 hover:scale-105"
        >
          INITIATE SEQUENCE
        </Button>

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