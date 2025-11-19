import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Terminal, User, AlertTriangle, Database, Eye, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [error, setError] = useState('');
  const [matrixChars, setMatrixChars] = useState<string[]>([]);
  const [showBreach, setShowBreach] = useState(false);

  // Matrix rain effect
  useEffect(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const newChars = [];
    for (let i = 0; i < 30; i++) {
      newChars.push(chars[Math.floor(Math.random() * chars.length)]);
    }
    setMatrixChars(newChars);

    const interval = setInterval(() => {
      setMatrixChars(prev => 
        prev.map(() => chars[Math.floor(Math.random() * chars.length)])
      );
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Show breach alert after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBreach(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
    <div className="min-h-screen bg-dark-bg relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg"
          animate={{
            background: [
              'linear-gradient(45deg, #0a0a0a, #111111, #0a0a0a)',
              'linear-gradient(135deg, #0a0a0a, #1a1a2e, #0a0a0a)',
              'linear-gradient(225deg, #0a0a0a, #111111, #0a0a0a)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        
        {/* Matrix rain effect */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {matrixChars.map((char, i) => (
            <motion.div
              key={i}
              className="absolute text-neon-green font-mono text-sm"
              style={{
                left: `${(i % 6) * 16.66}%`,
                top: `${Math.floor(i / 6) * 20}%`,
              }}
              animate={{
                y: [0, 100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              {char}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Breach Alert */}
      <AnimatePresence>
        {showBreach && (
          <motion.div
            className="absolute top-4 left-4 right-4 z-50"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-destructive/90 border-destructive backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  >
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-white font-bold">SECURITY BREACH DETECTED</h3>
                    <p className="text-white/90 text-sm">IEEE Student Branch CUK - 5,247 records compromised</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-md w-full">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-neon-green neon-text mb-4"
              data-text="DECODE WARS"
              animate={{
                textShadow: [
                  '0 0 10px #00ff41',
                  '0 0 20px #00ff41',
                  '0 0 30px #00ff41',
                  '0 0 20px #00ff41',
                  '0 0 10px #00ff41',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              DECODE WARS
            </motion.h1>
            <motion.p 
              className="text-lg text-neon-blue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              IEEE CUK Investigation Portal
            </motion.p>
            <motion.p 
              className="text-sm text-gray-400 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Enter your identity to access the case files
            </motion.p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="bg-dark-card/90 border-neon-green/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-neon-green flex items-center justify-center">
                  {showPasswordField ? (
                    <>
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Shield className="w-6 h-6 mr-2" />
                      </motion.div>
                      ADMIN ACCESS
                    </>
                  ) : (
                    <>
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        <User className="w-6 h-6 mr-2" />
                      </motion.div>
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
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        onClick={handleUsernameSubmit}
                        className="w-full bg-neon-green text-black hover:bg-neon-green/80 neon-glow"
                      >
                        AUTHENTICATE
                      </Button>
                    </motion.div>
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
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        onClick={handlePasswordSubmit}
                        className="w-full bg-neon-purple text-white hover:bg-neon-purple/80 neon-glow"
                      >
                        ACCESS GRANTED
                      </Button>
                    </motion.div>
                  </>
                )}
                
                <AnimatePresence>
                  {error && (
                    <motion.p 
                      className="text-destructive text-center text-sm neon-text"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Section */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <motion.div 
                className="bg-dark-card/90 border border-neon-blue/30 p-3 rounded-lg backdrop-blur-sm"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Terminal className="w-6 h-6 text-neon-blue mx-auto mb-2" />
                </motion.div>
                <p className="text-neon-blue font-medium">Hacker Path</p>
                <p className="text-gray-400 text-xs">Cover your tracks</p>
              </motion.div>
              <motion.div 
                className="bg-dark-card/90 border border-neon-purple/30 p-3 rounded-lg backdrop-blur-sm"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 20px rgba(123, 44, 191, 0.3)',
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Shield className="w-6 h-6 text-neon-purple mx-auto mb-2" />
                </motion.div>
                <p className="text-neon-purple font-medium">Detective Path</p>
                <p className="text-gray-400 text-xs">Solve the case</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Case Brief */}
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Card className="bg-dark-card/80 border-neon-green/20 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <Database className="w-5 h-5 text-neon-green mt-1" />
                  </motion.div>
                  <div>
                    <h3 className="text-neon-green font-bold text-sm">CASE BRIEF</h3>
                    <p className="text-gray-300 text-xs mt-1">
                      Internal data breach at IEEE Student Branch CUK. Sensitive student records compromised. 
                      Suspect is an internal member with database access. Choose your role in this cyber investigation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}