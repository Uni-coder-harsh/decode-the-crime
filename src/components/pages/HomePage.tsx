import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Terminal, User } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [error, setError] = useState('');

  const handleUsernameSubmit = () => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    // Store username for use throughout the app
    localStorage.setItem('playerUsername', username.trim());

    if (username === 'Admin@123@#') {
      setShowPasswordField(true);
      setError('');
    } else if (username.toLowerCase().includes('progya') || username.toLowerCase().includes('progyadipta')) {
      // Hacker story page
      navigate('/hacker-story');
    } else {
      // Detective story page
      navigate('/detective-story');
    }
  };

  const handlePasswordSubmit = () => {
    if (password === 'pass@123') {
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
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-5xl md:text-6xl font-bold text-neon-green neon-text mb-4"
            data-text="DECODE WARS"
          >
            DECODE WARS
          </h1>
          <p className="text-lg text-neon-blue">
            Enter Your Identity
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-dark-card border-neon-green/30">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-neon-green flex items-center justify-center">
              {showPasswordField ? (
                <>
                  <Shield className="w-6 h-6 mr-2" />
                  ADMIN ACCESS
                </>
              ) : (
                <>
                  <User className="w-6 h-6 mr-2" />
                  IDENTITY VERIFICATION
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-dark-card border border-neon-blue/30 p-3 rounded-lg">
              <Terminal className="w-6 h-6 text-neon-blue mx-auto mb-2" />
              <p className="text-neon-blue font-medium">Hacker Path</p>
              <p className="text-gray-400 text-xs">For coding warriors</p>
            </div>
            <div className="bg-dark-card border border-neon-purple/30 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-neon-purple mx-auto mb-2" />
              <p className="text-neon-purple font-medium">Detective Path</p>
              <p className="text-gray-400 text-xs">For mystery solvers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}