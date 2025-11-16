import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { HackerTasks, DetectivePuzzles, GameRecords, PlayerProfiles } from '@/entities';
import { 
  Terminal, 
  Clock, 
  Trophy, 
  Code, 
  Shield, 
  Send, 
  Lightbulb,
  Users,
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Pause
} from 'lucide-react';

interface Player {
  id: string;
  username: string;
  role: 'hacker' | 'detective';
  score: number;
  tasksCompleted: number;
  isOnline: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit: number;
  type: 'hacker' | 'detective';
  isCompleted: boolean;
  boilerplate?: string;
  testCases?: string[];
}

interface GameState {
  status: 'waiting' | 'active' | 'paused' | 'finished';
  timeRemaining: number;
  currentRound: number;
  totalRounds: number;
  roomName: string;
}

export default function GamePage() {
  const location = useLocation();
  const roomInfo = location.state as { roomId?: string; roomName?: string } || {};
  
  const [gameState, setGameState] = useState<GameState>({
    status: 'active',
    timeRemaining: 2700, // 45 minutes
    currentRound: 1,
    totalRounds: 3,
    roomName: roomInfo.roomName || 'Live Game Room'
  });

  const [currentPlayer] = useState<Player>({
    id: 'current-user',
    username: localStorage.getItem('playerUsername') || 'Player',
    role: 'hacker',
    score: 0,
    tasksCompleted: 0,
    isOnline: true
  });

  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [detectivePuzzle, setDetectivePuzzle] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const [codeSubmission, setCodeSubmission] = useState('');
  const [puzzleAnswer, setPuzzleAnswer] = useState('');
  const [accusationTarget, setAccusationTarget] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    try {
      // Load real data from database
      const [hackerTasksData, detectivePuzzlesData, playersData] = await Promise.all([
        BaseCrudService.getAll<HackerTasks>('hackertasks'),
        BaseCrudService.getAll<DetectivePuzzles>('detectivepuzzles'),
        BaseCrudService.getAll<PlayerProfiles>('playerprofiles')
      ]);

      // Set current task from real hacker tasks
      if (hackerTasksData.items.length > 0) {
        const task = hackerTasksData.items[0];
        setCurrentTask({
          id: task._id,
          title: task.taskName || 'Coding Challenge',
          description: task.description || task.problemStatement || 'No description available',
          difficulty: task.difficultyLevel ? 
            (task.difficultyLevel <= 2 ? 'easy' : task.difficultyLevel <= 4 ? 'medium' : 'hard') : 'medium',
          points: task.difficultyLevel ? task.difficultyLevel * 20 : 100,
          timeLimit: 900,
          type: 'hacker',
          isCompleted: false,
          boilerplate: task.boilerplateCode || '// Write your solution here\n',
          testCases: task.testCasesJson ? JSON.parse(task.testCasesJson) : []
        });
        setCodeSubmission(task.boilerplateCode || '// Write your solution here\n');
      }

      // Set detective puzzle from real detective puzzles
      if (detectivePuzzlesData.items.length > 0) {
        const puzzle = detectivePuzzlesData.items[0];
        setDetectivePuzzle({
          id: puzzle._id,
          title: puzzle.puzzleTitle || 'Detective Mystery',
          description: puzzle.question || 'No question available',
          difficulty: puzzle.difficulty as 'easy' | 'medium' | 'hard' || 'medium',
          points: puzzle.difficulty === 'easy' ? 50 : puzzle.difficulty === 'hard' ? 150 : 100,
          timeLimit: 600,
          type: 'detective',
          isCompleted: false
        });
      }

      // Convert player profiles to leaderboard format
      const leaderboardData: Player[] = playersData.items.map(player => ({
        id: player._id,
        username: player.username || 'Anonymous',
        role: Math.random() > 0.5 ? 'hacker' : 'detective', // Random role assignment for demo
        score: player.currentRank || 0,
        tasksCompleted: player.gamesPlayed || 0,
        isOnline: true
      }));

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading game data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (gameState.status === 'active') {
      const timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: Math.max(0, prev.timeRemaining - 1)
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState.status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeSubmission = async () => {
    if (!currentTask) return;
    
    setSubmissionStatus('submitting');
    
    try {
      // Create game record
      await BaseCrudService.create<GameRecords>('gamerecords', {
        _id: crypto.randomUUID(),
        sessionId: roomInfo.roomId || 'default-session',
        startTime: new Date(),
        endTime: new Date(),
        durationSeconds: 2700 - gameState.timeRemaining,
        playerScore: currentTask.points,
        outcome: 'completed',
        puzzleId: currentTask.id
      });

      // Simulate code execution
      const isCorrect = Math.random() > 0.3; // 70% success rate
      setSubmissionStatus(isCorrect ? 'success' : 'error');
      
      if (isCorrect && currentTask) {
        setCurrentTask({ ...currentTask, isCompleted: true });
        // Update leaderboard
        setLeaderboard(prev => 
          prev.map(player => 
            player.id === currentPlayer.id 
              ? { ...player, score: player.score + currentTask.points, tasksCompleted: player.tasksCompleted + 1 }
              : player
          )
        );
      }
      
      setTimeout(() => setSubmissionStatus('idle'), 3000);
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmissionStatus('error');
      setTimeout(() => setSubmissionStatus('idle'), 3000);
    }
  };

  const handlePuzzleSubmission = async () => {
    if (!detectivePuzzle) return;
    
    setSubmissionStatus('submitting');
    
    try {
      // Create game record
      await BaseCrudService.create<GameRecords>('gamerecords', {
        _id: crypto.randomUUID(),
        sessionId: roomInfo.roomId || 'default-session',
        startTime: new Date(),
        endTime: new Date(),
        durationSeconds: 600 - (detectivePuzzle.timeLimit || 600),
        playerScore: detectivePuzzle.points,
        outcome: 'completed',
        puzzleId: detectivePuzzle.id
      });

      // Check answer (simplified validation)
      const isCorrect = puzzleAnswer.trim().length > 0;
      setSubmissionStatus(isCorrect ? 'success' : 'error');
      
      if (isCorrect) {
        setDetectivePuzzle({ ...detectivePuzzle, isCompleted: true });
        // Update leaderboard
        setLeaderboard(prev => 
          prev.map(player => 
            player.id === currentPlayer.id 
              ? { ...player, score: player.score + detectivePuzzle.points, tasksCompleted: player.tasksCompleted + 1 }
              : player
          )
        );
      }
      
      setTimeout(() => setSubmissionStatus('idle'), 3000);
    } catch (error) {
      console.error('Error submitting puzzle answer:', error);
      setSubmissionStatus('error');
      setTimeout(() => setSubmissionStatus('idle'), 3000);
    }
  };

  const handleAccusation = async () => {
    if (!accusationTarget.trim()) return;
    
    try {
      // Create game record for accusation
      await BaseCrudService.create<GameRecords>('gamerecords', {
        _id: crypto.randomUUID(),
        sessionId: roomInfo.roomId || 'default-session',
        startTime: new Date(),
        endTime: new Date(),
        durationSeconds: 0,
        playerScore: 0,
        outcome: `accusation_against_${accusationTarget}`,
        puzzleId: 'accusation'
      });
      
      console.log(`Accusation made against: ${accusationTarget}`);
      setAccusationTarget('');
    } catch (error) {
      console.error('Error submitting accusation:', error);
    }
  };

  const useHint = () => {
    setHintsUsed(prev => prev + 1);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-neon-green text-xl neon-text">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg matrix-bg">
      {/* Game Header */}
      <header className="flex items-center justify-between p-4 bg-dark-card border-b border-neon-green/20">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Terminal className="h-6 w-6 text-neon-green" />
            <span className="font-heading font-bold text-neon-green">{gameState.roomName}</span>
          </div>
          <Badge variant="outline" className="border-neon-blue text-neon-blue">
            Round {gameState.currentRound}/{gameState.totalRounds}
          </Badge>
        </div>

        <div className="flex items-center space-x-6">
          {/* Timer */}
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-neon-purple" />
            <span className="font-heading text-lg text-neon-green">
              {formatTime(gameState.timeRemaining)}
            </span>
          </div>

          {/* Player Info */}
          <div className="flex items-center space-x-2">
            {currentPlayer.role === 'hacker' ? (
              <Code className="h-5 w-5 text-neon-blue" />
            ) : (
              <Shield className="h-5 w-5 text-neon-purple" />
            )}
            <span className="font-paragraph text-neon-green">{currentPlayer.username}</span>
            <Badge variant="default" className="bg-neon-green text-black">
              {currentPlayer.score} pts
            </Badge>
          </div>

          <Button asChild variant="outline" size="sm" className="border-neon-green text-neon-green hover:bg-neon-green hover:text-black">
            <Link to="/lobby">Leave Game</Link>
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Game Area */}
        <div className="flex-1 p-6">
          <Tabs defaultValue={currentPlayer.role === 'hacker' ? 'coding' : 'detective'} className="h-full">
            <TabsList className="bg-dark-card border border-neon-green/30">
              <TabsTrigger value="coding" disabled={currentPlayer.role !== 'hacker'} className="data-[state=active]:bg-neon-green data-[state=active]:text-black">
                Coding Tasks
              </TabsTrigger>
              <TabsTrigger value="detective" disabled={currentPlayer.role !== 'detective'} className="data-[state=active]:bg-neon-blue data-[state=active]:text-black">
                Detective Puzzles
              </TabsTrigger>
              <TabsTrigger value="accusations" disabled={currentPlayer.role !== 'detective'} className="data-[state=active]:bg-neon-purple data-[state=active]:text-black">
                Accusations
              </TabsTrigger>
            </TabsList>

            {/* Hacker Coding Tasks */}
            <TabsContent value="coding" className="h-full mt-6">
              {currentTask ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  {/* Task Description */}
                  <Card className="bg-dark-card border-neon-green/30 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-heading font-bold text-neon-green">
                        {currentTask.title}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="border-neon-blue text-neon-blue">
                          {currentTask.points} pts
                        </Badge>
                        <span className={`font-paragraph text-sm font-semibold ${getDifficultyColor(currentTask.difficulty)}`}>
                          {currentTask.difficulty.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <p className="font-paragraph text-gray-300 leading-relaxed">
                        {currentTask.description}
                      </p>

                      {currentTask.testCases && currentTask.testCases.length > 0 && (
                        <div>
                          <h3 className="font-heading font-semibold text-neon-green mb-2">Test Cases:</h3>
                          <div className="space-y-2">
                            {currentTask.testCases.map((testCase, index) => (
                              <div key={index} className="bg-dark-bg p-3 rounded border border-neon-green/20">
                                <pre className="text-sm text-gray-300 whitespace-pre-wrap">{testCase}</pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={useHint}
                          variant="outline"
                          size="sm"
                          disabled={hintsUsed >= 2}
                          className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black"
                        >
                          <Lightbulb className="mr-1 h-4 w-4" />
                          Hint ({hintsUsed}/2)
                        </Button>
                        <span className="font-paragraph text-sm text-gray-400">
                          Time limit: {formatTime(currentTask.timeLimit)}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Code Editor */}
                  <Card className="bg-dark-card border-neon-green/30 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-heading font-semibold text-neon-green">Code Editor</h3>
                      <div className="flex items-center space-x-2">
                        {submissionStatus === 'success' && (
                          <div className="flex items-center space-x-1 text-green-500">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-paragraph text-sm">Accepted!</span>
                          </div>
                        )}
                        {submissionStatus === 'error' && (
                          <div className="flex items-center space-x-1 text-red-500">
                            <XCircle className="h-4 w-4" />
                            <span className="font-paragraph text-sm">Wrong Answer</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Textarea
                      value={codeSubmission}
                      onChange={(e) => setCodeSubmission(e.target.value)}
                      placeholder="Write your solution here..."
                      className="flex-1 font-mono text-sm resize-none bg-dark-bg border-neon-green/50 text-neon-green"
                      disabled={currentTask.isCompleted}
                    />

                    <div className="mt-4 flex space-x-2">
                      <Button
                        onClick={handleCodeSubmission}
                        disabled={submissionStatus === 'submitting' || currentTask.isCompleted}
                        className="bg-neon-green text-black hover:bg-neon-green/80"
                      >
                        {submissionStatus === 'submitting' ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Solution
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black">
                        Test Code
                      </Button>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">No coding tasks available</p>
                </div>
              )}
            </TabsContent>

            {/* Detective Puzzles */}
            <TabsContent value="detective" className="h-full mt-6">
              {detectivePuzzle ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  {/* Puzzle Description */}
                  <Card className="bg-dark-card border-neon-blue/30 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-heading font-bold text-neon-blue">
                        {detectivePuzzle.title}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="border-neon-purple text-neon-purple">
                          {detectivePuzzle.points} pts
                        </Badge>
                        <span className={`font-paragraph text-sm font-semibold ${getDifficultyColor(detectivePuzzle.difficulty)}`}>
                          {detectivePuzzle.difficulty.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="bg-dark-bg p-4 rounded border border-neon-blue/20">
                        <p className="font-paragraph text-gray-300 leading-relaxed whitespace-pre-line">
                          {detectivePuzzle.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={useHint}
                          variant="outline"
                          size="sm"
                          disabled={hintsUsed >= 2}
                          className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black"
                        >
                          <Lightbulb className="mr-1 h-4 w-4" />
                          Hint ({hintsUsed}/2)
                        </Button>
                        <span className="font-paragraph text-sm text-gray-400">
                          Time limit: {formatTime(detectivePuzzle.timeLimit)}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Answer Input */}
                  <Card className="bg-dark-card border-neon-blue/30 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-heading font-semibold text-neon-blue">Your Answer</h3>
                      <div className="flex items-center space-x-2">
                        {submissionStatus === 'success' && (
                          <div className="flex items-center space-x-1 text-green-500">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-paragraph text-sm">Correct!</span>
                          </div>
                        )}
                        {submissionStatus === 'error' && (
                          <div className="flex items-center space-x-1 text-red-500">
                            <XCircle className="h-4 w-4" />
                            <span className="font-paragraph text-sm">Incorrect</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Textarea
                      value={puzzleAnswer}
                      onChange={(e) => setPuzzleAnswer(e.target.value)}
                      placeholder="Enter your answer here..."
                      className="flex-1 font-paragraph resize-none bg-dark-bg border-neon-blue/50 text-neon-green"
                      disabled={detectivePuzzle.isCompleted}
                    />

                    <div className="mt-4">
                      <Button
                        onClick={handlePuzzleSubmission}
                        disabled={submissionStatus === 'submitting' || detectivePuzzle.isCompleted || !puzzleAnswer.trim()}
                        className="w-full bg-neon-blue text-black hover:bg-neon-blue/80"
                      >
                        {submissionStatus === 'submitting' ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Answer
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">No detective puzzles available</p>
                </div>
              )}
            </TabsContent>

            {/* Accusations */}
            <TabsContent value="accusations" className="h-full mt-6">
              <Card className="bg-dark-card border-neon-purple/30 p-6 max-w-2xl mx-auto">
                <div className="flex items-center space-x-2 mb-6">
                  <Target className="h-6 w-6 text-neon-purple" />
                  <h2 className="text-2xl font-heading font-bold text-neon-purple">Make an Accusation</h2>
                </div>

                <div className="space-y-6">
                  <div className="bg-yellow-900/20 border border-yellow-400/30 p-4 rounded">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                      <div>
                        <h3 className="font-heading font-semibold text-yellow-400 mb-1">Warning</h3>
                        <p className="font-paragraph text-sm text-gray-300">
                          Making a false accusation will result in a point penalty. Be sure you have enough evidence before proceeding.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accusation-target" className="font-paragraph font-semibold text-neon-green mb-2 block">
                      Select Player to Accuse
                    </Label>
                    <Input
                      id="accusation-target"
                      value={accusationTarget}
                      onChange={(e) => setAccusationTarget(e.target.value)}
                      placeholder="Enter player username"
                      className="bg-dark-bg border-neon-purple/50 text-neon-green"
                    />
                  </div>

                  <div>
                    <h3 className="font-heading font-semibold text-neon-green mb-3">Available Players</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {leaderboard
                        .filter(player => player.role === 'hacker' && player.id !== currentPlayer.id)
                        .map(player => (
                          <Button
                            key={player.id}
                            variant="outline"
                            size="sm"
                            onClick={() => setAccusationTarget(player.username)}
                            className="border-neon-green text-neon-green hover:bg-neon-green hover:text-black justify-start"
                          >
                            <Code className="mr-2 h-4 w-4" />
                            {player.username}
                          </Button>
                        ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAccusation}
                    disabled={!accusationTarget.trim()}
                    className="w-full bg-destructive text-white hover:bg-destructive/80"
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Submit Accusation
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Leaderboard */}
        <div className="w-80 bg-dark-card border-l border-neon-green/20 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Trophy className="h-6 w-6 text-neon-green" />
            <h2 className="text-xl font-heading font-bold text-neon-green">Live Leaderboard</h2>
          </div>

          <div className="space-y-3">
            {leaderboard
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-3 rounded border ${
                    player.id === currentPlayer.id 
                      ? 'bg-neon-green/10 border-neon-green/30' 
                      : 'bg-dark-bg border-neon-blue/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-heading font-bold text-lg text-neon-green">
                        #{index + 1}
                      </span>
                      <div className="flex items-center space-x-1">
                        {player.role === 'hacker' ? (
                          <Code className="h-4 w-4 text-neon-blue" />
                        ) : (
                          <Shield className="h-4 w-4 text-neon-purple" />
                        )}
                        <span className="font-paragraph font-semibold text-neon-green">
                          {player.username}
                        </span>
                        {player.id === currentPlayer.id && (
                          <Badge variant="default" className="bg-neon-green text-black text-xs">YOU</Badge>
                        )}
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${player.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-paragraph text-gray-400">
                      {player.tasksCompleted} tasks completed
                    </span>
                    <span className="font-heading font-bold text-neon-blue">
                      {player.score} pts
                    </span>
                  </div>
                </motion.div>
              ))}
          </div>

          <Separator className="my-6 bg-neon-green/20" />

          {/* Game Progress */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-neon-green">Game Progress</h3>
            
            <div>
              <div className="flex justify-between text-sm font-paragraph text-gray-400 mb-1">
                <span>Time Remaining</span>
                <span>{formatTime(gameState.timeRemaining)}</span>
              </div>
              <Progress 
                value={(gameState.timeRemaining / 2700) * 100} 
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm font-paragraph text-gray-400 mb-1">
                <span>Round Progress</span>
                <span>{gameState.currentRound}/{gameState.totalRounds}</span>
              </div>
              <Progress 
                value={(gameState.currentRound / gameState.totalRounds) * 100} 
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-heading font-bold text-neon-blue">
                  {leaderboard.filter(p => p.role === 'hacker').length}
                </div>
                <div className="font-paragraph text-xs text-gray-400">Hackers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-heading font-bold text-neon-purple">
                  {leaderboard.filter(p => p.role === 'detective').length}
                </div>
                <div className="font-paragraph text-xs text-gray-400">Detectives</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}