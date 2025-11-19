import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ChevronLeft, ChevronRight, ExternalLink, Search, Eye, FileText, Target, AlertTriangle, Database, Users, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const storySlides = [
  {
    title: "THE INCIDENT REPORT",
    content: "You are Detective Sarah Chen, a cybercrime specialist called to investigate a serious data breach at the IEEE Student Branch, Central University of Karnataka. Over 5,000 student records containing personal information, academic data, and contact details have been compromised. The breach appears to be an inside job.",
    icon: <AlertTriangle className="w-12 h-12 text-destructive animate-pulse" />,
    bgEffect: "investigation"
  },
  {
    title: "INITIAL INVESTIGATION",
    content: "Your preliminary analysis reveals that the breach occurred during normal business hours, suggesting someone with legitimate access was involved. The attacker knew exactly where to find the most sensitive data and how to extract it without triggering immediate alarms. This was no random attack - it was calculated and precise.",
    icon: <Search className="w-12 h-12 text-neon-blue" />,
    bgEffect: "evidence"
  },
  {
    title: "THE DIGITAL TRAIL",
    content: "As you dig deeper, you discover that someone is actively trying to cover their tracks. Log files are being deleted, security footage metadata is corrupted, and network traces are disappearing. The perpetrator is still in the system, desperately trying to erase evidence of their crime. Time is running out.",
    icon: <Database className="w-12 h-12 text-neon-purple" />,
    bgEffect: "forensics"
  },
  {
    title: "THE FINAL PURSUIT",
    content: "You've narrowed down the suspects to internal members with database access. The hacker is making their final moves to escape detection. Use your analytical skills, pattern recognition, and logical deduction to solve complex puzzles that will reveal the identity of the culprit and bring them to justice.",
    icon: <Target className="w-12 h-12 text-neon-green" />,
    bgEffect: "pursuit"
  }
];

export default function DetectiveStoryPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scanningLines, setScanningLines] = useState<number[]>([]);

  // Detective scanning animation
  useEffect(() => {
    const lines = Array.from({ length: 20 }, (_, i) => i);
    setScanningLines(lines);

    const interval = setInterval(() => {
      setScanningLines(prev => 
        prev.map(line => Math.random() > 0.7 ? Math.random() * 100 : line)
      );
    }, 200);

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
      case 'investigation':
        return (
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-destructive/20 to-transparent"
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
            <div className="absolute top-4 left-4 text-destructive text-xs font-mono">
              <div>SECURITY BREACH DETECTED</div>
              <div>THREAT LEVEL: HIGH</div>
              <div>AFFECTED RECORDS: 5,247</div>
            </div>
          </div>
        );
      case 'evidence':
        return (
          <div className="absolute inset-0 opacity-10">
            {scanningLines.map((line, i) => (
              <motion.div
                key={i}
                className="absolute w-full h-0.5 bg-neon-blue"
                style={{ top: `${line}%` }}
                animate={{
                  opacity: [0, 1, 0],
                  scaleX: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
            <div className="absolute bottom-4 right-4 text-neon-blue text-xs font-mono">
              <div>SCANNING FOR EVIDENCE...</div>
              <div>DIGITAL FORENSICS ACTIVE</div>
            </div>
          </div>
        );
      case 'forensics':
        return (
          <div className="absolute inset-0 opacity-15">
            <motion.div
              className="text-neon-purple font-mono text-xs leading-tight"
              animate={{
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            >
              <div>LOG ANALYSIS:</div>
              <div className="text-neon-green">✓ Access logs: CORRUPTED</div>
              <div className="text-destructive">✗ Security footage: DELETED</div>
              <div className="text-neon-blue">⚠ Network traces: PARTIAL</div>
              <div className="text-neon-purple">→ Suspect still active in system</div>
            </motion.div>
          </div>
        );
      case 'pursuit':
        return (
          <div className="absolute inset-0 opacity-10">
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 20%, rgba(0, 255, 65, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 80%, rgba(123, 44, 191, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)',
                ],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
              }}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <motion.div
                className="text-neon-green text-lg font-bold"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                TARGET ACQUIRED
              </motion.div>
            </div>
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
              'linear-gradient(45deg, #0a0a0a, #1a1a2e, #0a0a0a)',
              'linear-gradient(135deg, #0a0a0a, #16213e, #0a0a0a)',
              'linear-gradient(225deg, #0a0a0a, #1a1a2e, #0a0a0a)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>

      {/* Detective badge animation */}
      <motion.div
        className="absolute top-8 right-8 z-20"
        animate={{
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
      >
        <div className="bg-dark-card/80 border border-neon-purple/50 rounded-full p-4 backdrop-blur-sm">
          <Shield className="w-8 h-8 text-neon-purple" />
        </div>
      </motion.div>

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
              className="text-4xl md:text-6xl font-bold text-neon-purple neon-text mb-4"
              animate={{
                textShadow: [
                  '0 0 10px #7b2cbf',
                  '0 0 20px #7b2cbf',
                  '0 0 10px #7b2cbf',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              DETECTIVE PROTOCOL
            </motion.h1>
            <motion.p
              className="text-lg text-neon-blue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              IEEE CUK Data Breach Investigation
            </motion.p>
          </motion.div>

          {/* Story Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-dark-card/90 border-neon-purple/30 min-h-[500px] relative backdrop-blur-sm">
                {getBackgroundEffect(storySlides[currentSlide].bgEffect)}
                <CardHeader className="relative z-10">
                  <motion.div
                    className="flex items-center justify-center mb-4"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, -5, 5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  >
                    {storySlides[currentSlide].icon}
                  </motion.div>
                  <CardTitle className="text-center text-2xl text-neon-purple">
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
                            index === currentSlide ? 'bg-neon-purple' : 'bg-gray-600'
                          }`}
                          animate={{
                            scale: index === currentSlide ? [1, 1.2, 1] : 1,
                            boxShadow: index === currentSlide ? [
                              '0 0 0px rgba(123, 44, 191, 0.5)',
                              '0 0 10px rgba(123, 44, 191, 0.8)',
                              '0 0 0px rgba(123, 44, 191, 0.5)',
                            ] : 'none',
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
                      className="text-center pt-8 border-t border-neon-purple/30"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="text-xl text-neon-purple mb-4">Ready to Solve the Case?</h3>
                      <motion.a 
                        href="https://www.hackerrank.com/decode-wars"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: '0 0 30px rgba(123, 44, 191, 0.5)',
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Shield className="w-6 h-6" />
                        BEGIN INVESTIGATION
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
            <div className="bg-dark-card/90 border border-neon-purple/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex justify-between text-sm text-neon-blue mb-2">
                <span>Investigation Progress</span>
                <span>{currentSlide + 1} / {storySlides.length}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-neon-purple to-neon-blue h-2 rounded-full"
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