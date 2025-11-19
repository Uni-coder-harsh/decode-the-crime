import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ChevronLeft, ChevronRight, ExternalLink, Search, Eye, FileText, Target } from 'lucide-react';

const storySlides = [
  {
    title: "THE MYSTERY BEGINS",
    content: "You are Detective Alex Morgan, a brilliant investigator in the year 2045. The city is plagued by a series of digital crimes that seem impossible to solve. Each case is more complex than the last, requiring not just intuition, but logical reasoning and pattern recognition.",
    icon: <Search className="w-12 h-12 text-neon-purple" />
  },
  {
    title: "THE DIGITAL CONSPIRACY",
    content: "A new case lands on your desk: 'The Decode Wars Conspiracy.' Someone is using complex puzzles and riddles to hide criminal activities in plain sight. The evidence is scattered across digital platforms, waiting for a keen mind to piece it together.",
    icon: <Eye className="w-12 h-12 text-neon-blue" />
  },
  {
    title: "THE INVESTIGATION",
    content: "Your task is to solve intricate puzzles that will reveal the truth behind the conspiracy. Each clue you uncover brings you closer to the mastermind. Use your deductive reasoning, pattern recognition, and logical thinking to crack the case.",
    icon: <FileText className="w-12 h-12 text-neon-green" />
  },
  {
    title: "THE FINAL CHALLENGE",
    content: "The trail has led you to the ultimate test. The criminal mastermind has prepared a series of challenges that will test every aspect of your detective skills. Only by solving these puzzles can you bring justice and solve the Decode Wars mystery.",
    icon: <Target className="w-12 h-12 text-neon-purple" />
  }
];

export default function DetectiveStoryPage() {
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
          <h1 className="text-4xl md:text-6xl font-bold text-neon-purple neon-text mb-4">
            DETECTIVE PROTOCOL
          </h1>
          <p className="text-lg text-neon-blue">
            Welcome to the Investigation, Detective
          </p>
        </div>

        {/* Story Card */}
        <Card className="bg-dark-card border-neon-purple/30 min-h-[500px]">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              {storySlides[currentSlide].icon}
            </div>
            <CardTitle className="text-center text-2xl text-neon-purple">
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
                      index === currentSlide ? 'bg-neon-purple' : 'bg-gray-600'
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
              <div className="text-center pt-8 border-t border-neon-purple/30">
                <h3 className="text-xl text-neon-purple mb-4">Ready to Solve the Mystery?</h3>
                <a 
                  href="https://www.hackerrank.com/decode-wars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold text-lg px-8 py-4 rounded-lg hover:scale-105 transition-all duration-300 neon-glow hover:shadow-2xl hover:shadow-neon-purple/50"
                >
                  <Shield className="w-6 h-6" />
                  BEGIN INVESTIGATION - DETECTIVE CHALLENGES
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="bg-dark-card border border-neon-purple/30 rounded-lg p-4">
            <div className="flex justify-between text-sm text-neon-blue mb-2">
              <span>Investigation Progress</span>
              <span>{currentSlide + 1} / {storySlides.length}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-neon-purple to-neon-blue h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / storySlides.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}