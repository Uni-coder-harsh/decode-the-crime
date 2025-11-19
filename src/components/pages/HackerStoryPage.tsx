import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, ChevronLeft, ChevronRight, ExternalLink, Code, Zap, Shield } from 'lucide-react';

const storySlides = [
  {
    title: "THE AWAKENING",
    content: "You are a skilled hacker in the year 2045. The digital world has become a battleground where code is your weapon and algorithms are your armor. The Matrix Corporation controls all digital infrastructure, but resistance groups fight back through the shadows of cyberspace.",
    icon: <Terminal className="w-12 h-12 text-neon-green" />
  },
  {
    title: "THE MISSION",
    content: "A mysterious message appears on your encrypted terminal: 'The Matrix has a vulnerability. We need someone with your skills to exploit it. Join the Decode Wars and prove you have what it takes to break their defenses.'",
    icon: <Code className="w-12 h-12 text-neon-blue" />
  },
  {
    title: "THE CHALLENGE",
    content: "Your mission is to infiltrate Matrix Corporation's systems by solving complex coding challenges. Each puzzle you solve weakens their defenses and brings the resistance closer to freedom. Your programming skills are the key to victory.",
    icon: <Zap className="w-12 h-12 text-neon-purple" />
  },
  {
    title: "THE CALL TO ACTION",
    content: "The time has come to prove yourself. Enter the digital battlefield where only the most skilled hackers survive. Your code will be your legacy. Are you ready to join the Decode Wars?",
    icon: <Shield className="w-12 h-12 text-neon-green" />
  }
];

export default function HackerStoryPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % storySlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + storySlides.length) % storySlides.length);
  };

  const isLastSlide = currentSlide === storySlides.length - 1;

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-neon-green neon-text mb-4">
            HACKER PROTOCOL
          </h1>
          <p className="text-lg text-neon-blue">
            Welcome to the Resistance, Agent
          </p>
        </div>

        {/* Story Card */}
        <Card className="bg-dark-card border-neon-green/30 min-h-[500px]">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              {storySlides[currentSlide].icon}
            </div>
            <CardTitle className="text-center text-2xl text-neon-green">
              {storySlides[currentSlide].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-lg text-gray-300 leading-relaxed">
                {storySlides[currentSlide].content}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8">
              <Button
                onClick={prevSlide}
                variant="outline"
                className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black"
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {/* Slide Indicators */}
              <div className="flex space-x-2">
                {storySlides.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentSlide ? 'bg-neon-green' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextSlide}
                variant="outline"
                className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black"
                disabled={isLastSlide}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Game Link - Show only on last slide */}
            {isLastSlide && (
              <div className="text-center pt-8 border-t border-neon-green/30">
                <h3 className="text-xl text-neon-green mb-4">Ready to Begin Your Mission?</h3>
                <a 
                  href="https://www.hackerrank.com/decode-wars-hacker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-neon-green to-neon-blue text-black font-bold text-lg px-8 py-4 rounded-lg hover:scale-105 transition-all duration-300 neon-glow hover:shadow-2xl hover:shadow-neon-green/50"
                >
                  <Terminal className="w-6 h-6" />
                  ENTER THE MATRIX - HACKER CHALLENGES
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="bg-dark-card border border-neon-green/30 rounded-lg p-4">
            <div className="flex justify-between text-sm text-neon-blue mb-2">
              <span>Story Progress</span>
              <span>{currentSlide + 1} / {storySlides.length}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-neon-green to-neon-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / storySlides.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}