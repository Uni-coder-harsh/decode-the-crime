import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { motion } from 'framer-motion';
import { Terminal, Shield, Users, Trophy, Clock, Code } from 'lucide-react';

export default function HomePage() {
  const [floatingElements, setFloatingElements] = useState<Array<{id: number, x: number, y: number, z: number, type: string}>>([]);

  useEffect(() => {
    // Generate floating geometric elements for the 3D space
    const elements = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60 + 20,
      z: Math.random() * 50 + 10,
      type: ['cube', 'pyramid', 'sphere'][Math.floor(Math.random() * 3)]
    }));
    setFloatingElements(elements);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative z-50 flex items-center justify-between p-6 bg-background/95 backdrop-blur-sm border-b border-primary/20">
        <div className="flex items-center space-x-2">
          <Terminal className="h-8 w-8 text-primary" />
          <span className="text-xl font-heading font-bold text-textprimary">DECODE THE CRIME</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/lobby" className="font-paragraph text-sm text-textprimary hover:text-primary transition-colors">
            JOIN GAME
          </Link>
          <Link to="/admin" className="font-paragraph text-sm text-textprimary hover:text-primary transition-colors">
            ADMIN PANEL
          </Link>
          <Link to="/leaderboard" className="font-paragraph text-sm text-textprimary hover:text-primary transition-colors">
            LEADERBOARD
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/lobby">Enter Competition</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section with 3D Grid */}
      <section className="relative w-full max-w-[120rem] mx-auto min-h-[80vh] overflow-hidden">
        {/* 3D Grid Background */}
        <div className="absolute inset-0 perspective-[1000px]">
          <div className="absolute inset-0 transform-gpu" style={{
            background: `
              linear-gradient(90deg, transparent 0%, transparent 49%, rgba(216, 64, 14, 0.3) 50%, rgba(216, 64, 14, 0.3) 51%, transparent 52%, transparent 100%),
              linear-gradient(0deg, transparent 0%, transparent 49%, rgba(216, 64, 14, 0.3) 50%, rgba(216, 64, 14, 0.3) 51%, transparent 52%, transparent 100%)
            `,
            backgroundSize: '60px 60px',
            transform: 'rotateX(75deg) translateZ(-200px)',
            transformOrigin: 'center bottom'
          }}>
          </div>
          
          {/* Floating Geometric Elements */}
          {floatingElements.map((element) => (
            <motion.div
              key={element.id}
              className="absolute w-8 h-8 bg-primary"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                transform: `translateZ(${element.z}px)`
              }}
              animate={{
                y: [0, -20, 0],
                rotateY: [0, 360],
                rotateX: [0, 180, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center min-h-[80vh] px-6">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Badge variant="outline" className="mb-4 font-paragraph">
                    REAL-TIME CODING COMPETITION
                  </Badge>
                  <h1 className="text-5xl lg:text-7xl font-heading font-bold text-textprimary leading-tight">
                    Decode the<br />
                    <span className="text-primary">Digital Crime</span>
                  </h1>
                </motion.div>
                
                <motion.p
                  className="text-lg font-paragraph text-textprimary/80 max-w-lg leading-relaxed"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  Enter a world where hackers and detectives clash in real-time coding battles. 
                  Solve puzzles, write code, and outsmart your opponents in this immersive 
                  cyber competition.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Button asChild size="lg" className="font-paragraph">
                    <Link to="/lobby">
                      <Users className="mr-2 h-5 w-5" />
                      Join Competition
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="font-paragraph">
                    <Link to="/admin">
                      <Shield className="mr-2 h-5 w-5" />
                      Admin Panel
                    </Link>
                  </Button>
                </motion.div>
              </div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <div className="relative bg-secondary p-8 rounded-lg border border-primary/20">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 bg-background border-primary/20">
                      <Code className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-heading font-semibold text-textprimary">Hacker Role</h3>
                      <p className="font-paragraph text-sm text-textprimary/70">Write code to solve complex algorithms</p>
                    </Card>
                    <Card className="p-4 bg-background border-primary/20">
                      <Shield className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-heading font-semibold text-textprimary">Detective Role</h3>
                      <p className="font-paragraph text-sm text-textprimary/70">Solve logic puzzles and catch hackers</p>
                    </Card>
                    <Card className="p-4 bg-background border-primary/20">
                      <Trophy className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-heading font-semibold text-textprimary">Live Rankings</h3>
                      <p className="font-paragraph text-sm text-textprimary/70">Real-time leaderboard updates</p>
                    </Card>
                    <Card className="p-4 bg-background border-primary/20">
                      <Clock className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-heading font-semibold text-textprimary">Timed Rounds</h3>
                      <p className="font-paragraph text-sm text-textprimary/70">Fast-paced competitive gameplay</p>
                    </Card>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-heading font-bold text-secondary-foreground mb-6">
                Advanced Competition Features
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded flex items-center justify-center flex-shrink-0">
                    <Terminal className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-secondary-foreground mb-2">Real-time Code Execution</h3>
                    <p className="font-paragraph text-secondary-foreground/80">
                      Code is executed and judged instantly using the Judge0 API with comprehensive test cases.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-secondary-foreground mb-2">Multi-user Lobbies</h3>
                    <p className="font-paragraph text-secondary-foreground/80">
                      Join lobbies with other players and compete in organized rooms with role assignments.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-secondary-foreground mb-2">Anti-cheat System</h3>
                    <p className="font-paragraph text-secondary-foreground/80">
                      Advanced monitoring and detection systems ensure fair play for all participants.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-background p-8 rounded-lg border border-primary/20">
              <h3 className="font-heading font-bold text-textprimary mb-4">Competition Stats</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-heading font-bold text-primary">500+</div>
                  <div className="font-paragraph text-sm text-textprimary/70">Active Players</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-heading font-bold text-primary">50+</div>
                  <div className="font-paragraph text-sm text-textprimary/70">Coding Challenges</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-heading font-bold text-primary">24/7</div>
                  <div className="font-paragraph text-sm text-textprimary/70">Live Competitions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-heading font-bold text-primary">99%</div>
                  <div className="font-paragraph text-sm text-textprimary/70">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-heading font-bold text-textprimary mb-6">
            Ready to Test Your Skills?
          </h2>
          <p className="text-lg font-paragraph text-textprimary/80 mb-8 max-w-2xl mx-auto">
            Join thousands of developers in the ultimate coding competition. 
            Whether you're a hacker or detective, prove your skills in real-time battles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-paragraph">
              <Link to="/lobby">
                Start Competing Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-paragraph">
              <Link to="/leaderboard">
                View Leaderboard
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Terminal className="h-6 w-6 text-primary" />
                <span className="font-heading font-bold text-secondary-foreground">DECODE THE CRIME</span>
              </div>
              <p className="font-paragraph text-sm text-secondary-foreground/70">
                The ultimate real-time coding competition platform.
              </p>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold text-secondary-foreground mb-4">Competition</h4>
              <div className="space-y-2">
                <Link to="/lobby" className="block font-paragraph text-sm text-secondary-foreground/70 hover:text-primary">
                  Join Game
                </Link>
                <Link to="/leaderboard" className="block font-paragraph text-sm text-secondary-foreground/70 hover:text-primary">
                  Leaderboard
                </Link>
                <Link to="/rules" className="block font-paragraph text-sm text-secondary-foreground/70 hover:text-primary">
                  Rules
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold text-secondary-foreground mb-4">Admin</h4>
              <div className="space-y-2">
                <Link to="/admin" className="block font-paragraph text-sm text-secondary-foreground/70 hover:text-primary">
                  Admin Panel
                </Link>
                <Link to="/admin/rooms" className="block font-paragraph text-sm text-secondary-foreground/70 hover:text-primary">
                  Manage Rooms
                </Link>
                <Link to="/admin/puzzles" className="block font-paragraph text-sm text-secondary-foreground/70 hover:text-primary">
                  Manage Puzzles
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold text-secondary-foreground mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block font-paragraph text-sm text-secondary-foreground/70 hover:text-primary">
                  Documentation
                </a>
                <a href="#" className="block font-paragraph text-sm text-secondary-foreground/70 hover:text-primary">
                  Contact
                </a>
                <a href="#" className="block font-paragraph text-sm text-secondary-foreground/70 hover:text-primary">
                  Discord
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary/20 mt-8 pt-8 text-center">
            <p className="font-paragraph text-sm text-secondary-foreground/70">
              © 2024 Decode the Crime. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}