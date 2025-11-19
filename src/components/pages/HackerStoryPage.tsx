import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, ChevronLeft, ChevronRight, ExternalLink, Code, Zap, Shield, AlertTriangle, Database, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const storySlides = [
  {
    title: "THE BREACH",
    content: "You are a skilled hacker who has successfully infiltrated the IEEE Student Branch database at Central University of Karnataka. Thousands of student records, personal data, and academic information are now at your fingertips. The breach was flawless - no one suspects a thing... yet.",
    icon: <Database className="w-12 h-12 text-neon-green" />,
    bgEffect: "matrix"
  },
  {
    title: "THE DISCOVERY",
    content: "Alert! The university's cybersecurity team has detected unusual activity. A detective has been assigned to investigate the data breach. Your identity as an internal member gives you an advantage, but time is running out. You must act fast to cover your tracks.",
    icon: <AlertTriangle className="w-12 h-12 text-destructive animate-pulse" />,
    bgEffect: "glitch"
  },
  {
    title: "OPERATION CLEANUP",
    content: "Your mission: Delete all traces of your digital footprint before the detective pieces together the evidence. Access logs, security footage metadata, network traces - everything must disappear. Use your coding skills to write scripts that will erase your presence from the system.",
    icon: <Trash2 className="w-12 h-12 text-neon-blue" />,
    bgEffect: "code"
  },
  {
    title: "THE FINAL CHALLENGE",
    content: "The detective is closing in. Your only chance is to complete a series of advanced hacking challenges that will give you root access to the university's central servers. Delete the evidence, plant false leads, and escape into the digital shadows. Your coding expertise is your only salvation.",
    icon: <Shield className="w-12 h-12 text-neon-purple" />,
    bgEffect: "terminal"
  }
];

export default function HackerStoryPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [matrixChars, setMatrixChars] = useState<string[]>([]);

  // Matrix rain effect
  useEffect(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const newChars = [];
    for (let i = 0; i < 50; i++) {
      newChars.push(chars[Math.floor(Math.random() * chars.length)]);
    }
    setMatrixChars(newChars);

    const interval = setInterval(() => {
      setMatrixChars(prev => 
        prev.map(() => chars[Math.floor(Math.random() * chars.length)])
      );
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % storySlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + storySlides.length) % storySlides.length);
  };

  const isLastSlide = currentSlide === storySlides.length - 1;

  const getBackgroundEffect = (effect: string) => {
    switch (effect) {
      case 'matrix':
        return (
          <div className="absolute inset-0 overflow-hidden opacity-10">
            {matrixChars.map((char, i) => (
              <motion.div
                key={i}
                className="absolute text-neon-green font-mono text-sm"
                style={{
                  left: `${(i % 10) * 10}%`,
                  top: `${Math.floor(i / 10) * 20}%`,
                }}
                animate={{
                  y: [0, 100, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              >
                {char}
              </motion.div>
            ))}
          </div>
        );
      case 'glitch':
        return (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-destructive/5 to-neon-green/5"
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        );
      case 'code':
        return (
          <div className="absolute inset-0 opacity-5">
            <pre className="text-neon-blue text-xs leading-tight">
              {`function deleteEvidence() {
  const logs = await getLogs();
  logs.forEach(log => {
    if (log.contains('breach')) {
      log.delete();
    }
  });
  clearCache();
  overwriteMemory();
}`}
            </pre>
          </div>
        );
      case 'terminal':
        return (
          <div className="absolute inset-0 opacity-10">
            <motion.div
              className="text-neon-green font-mono text-xs"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <div>$ rm -rf /var/log/security/*</div>
              <div>$ history -c</div>
              <div>$ shred -vfz -n 3 /tmp/access.log</div>
              <div>$ echo "" {'>'}  ~/.bash_history</div>
              <div className="text-destructive">ACCESS DENIED</div>
              <div className="text-neon-blue">Attempting privilege escalation...</div>
            </motion.div>
          </div>
        );
      default:
        return null;
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
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-neon-green neon-text mb-4"
              animate={{
                textShadow: [
                  '0 0 10px #00ff41',
                  '0 0 20px #00ff41',
                  '0 0 10px #00ff41',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              HACKER PROTOCOL
            </motion.h1>
            <motion.p
              className="text-lg text-neon-blue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              IEEE CUK Data Breach - Operation Cover-Up
            </motion.p>
          </motion.div>

          {/* Story Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-dark-card/90 border-neon-green/30 min-h-[500px] relative backdrop-blur-sm">
                {getBackgroundEffect(storySlides[currentSlide].bgEffect)}
                <CardHeader className="relative z-10">
                  <motion.div
                    className="flex items-center justify-center mb-4"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  >
                    {storySlides[currentSlide].icon}
                  </motion.div>
                  <CardTitle className="text-center text-2xl text-neon-green">
                    {storySlides[currentSlide].title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                  <div className="text-center">
                    <motion.p
                      className="text-lg text-gray-300 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {storySlides[currentSlide].content}
                    </motion.p>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-8">
                    <Button
                      onClick={prevSlide}
                      variant="outline"
                      className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black transition-all duration-300"
                      disabled={currentSlide === 0}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    {/* Slide Indicators */}
                    <div className="flex space-x-2">
                      {storySlides.map((_, index) => (
                        <motion.div
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            index === currentSlide ? 'bg-neon-green' : 'bg-gray-600'
                          }`}
                          animate={{
                            scale: index === currentSlide ? [1, 1.2, 1] : 1,
                          }}
                          transition={{
                            duration: 0.5,
                          }}
                        />
                      ))}
                    </div>

                    <Button
                      onClick={nextSlide}
                      variant="outline"
                      className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black transition-all duration-300"
                      disabled={isLastSlide}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {/* Game Link - Show only on last slide */}
                  {isLastSlide && (
                    <motion.div
                      className="text-center pt-8 border-t border-neon-green/30"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="text-xl text-neon-green mb-4">Ready to Execute the Cover-Up?</h3>
                      <motion.a 
                        href="https://www.hackerrank.com/decode-wars-hacker"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-neon-green to-neon-blue text-black font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: '0 0 30px rgba(0, 255, 65, 0.5)',
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Terminal className="w-6 h-6" />
                        INITIATE HACKING SEQUENCE
                        <ExternalLink className="w-5 h-5" />
                      </motion.a>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="bg-dark-card/90 border border-neon-green/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex justify-between text-sm text-neon-blue mb-2">
                <span>Operation Progress</span>
                <span>{currentSlide + 1} / {storySlides.length}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-neon-green to-neon-blue h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentSlide + 1) / storySlides.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}