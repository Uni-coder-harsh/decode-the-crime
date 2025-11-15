import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Trophy, 
  Medal, 
  Crown, 
  Code, 
  Shield, 
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Users,
  Star
} from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  username: string;
  role: 'hacker' | 'detective';
  score: number;
  gamesPlayed: number;
  gamesWon: number;
  averageScore: number;
  bestScore: number;
  totalTime: number;
  rank: number;
  rankChange: number;
  lastActive: Date;
}

interface Tournament {
  id: string;
  name: string;
  date: Date;
  participants: number;
  winner: string;
  winnerRole: 'hacker' | 'detective';
  winnerScore: number;
}

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState('all-time');
  const [roleFilter, setRoleFilter] = useState('all');

  const [globalLeaderboard] = useState<LeaderboardEntry[]>([
    {
      id: '1',
      username: 'CyberMaster',
      role: 'hacker',
      score: 2850,
      gamesPlayed: 45,
      gamesWon: 32,
      averageScore: 185,
      bestScore: 420,
      totalTime: 2700,
      rank: 1,
      rankChange: 0,
      lastActive: new Date()
    },
    {
      id: '2',
      username: 'DetectiveElite',
      role: 'detective',
      score: 2720,
      gamesPlayed: 38,
      gamesWon: 28,
      averageScore: 195,
      bestScore: 380,
      totalTime: 2280,
      rank: 2,
      rankChange: 1,
      lastActive: new Date()
    },
    {
      id: '3',
      username: 'CodeNinja',
      role: 'hacker',
      score: 2650,
      gamesPlayed: 52,
      gamesWon: 31,
      averageScore: 175,
      bestScore: 390,
      totalTime: 3120,
      rank: 3,
      rankChange: -1,
      lastActive: new Date()
    },
    {
      id: '4',
      username: 'SherlockDev',
      role: 'detective',
      score: 2580,
      gamesPlayed: 41,
      gamesWon: 26,
      averageScore: 168,
      bestScore: 350,
      totalTime: 2460,
      rank: 4,
      rankChange: 2,
      lastActive: new Date()
    },
    {
      id: '5',
      username: 'ByteBreaker',
      role: 'hacker',
      score: 2490,
      gamesPlayed: 35,
      gamesWon: 22,
      averageScore: 162,
      bestScore: 340,
      totalTime: 2100,
      rank: 5,
      rankChange: -1,
      lastActive: new Date()
    },
    {
      id: '6',
      username: 'CyberSleuth',
      role: 'detective',
      score: 2420,
      gamesPlayed: 39,
      gamesWon: 24,
      averageScore: 158,
      bestScore: 325,
      totalTime: 2340,
      rank: 6,
      rankChange: 0,
      lastActive: new Date()
    },
    {
      id: '7',
      username: 'AlgoWizard',
      role: 'hacker',
      score: 2380,
      gamesPlayed: 33,
      gamesWon: 20,
      averageScore: 155,
      bestScore: 310,
      totalTime: 1980,
      rank: 7,
      rankChange: 1,
      lastActive: new Date()
    },
    {
      id: '8',
      username: 'LogicHunter',
      role: 'detective',
      score: 2340,
      gamesPlayed: 37,
      gamesWon: 21,
      averageScore: 152,
      bestScore: 295,
      totalTime: 2220,
      rank: 8,
      rankChange: -2,
      lastActive: new Date()
    }
  ]);

  const [recentTournaments] = useState<Tournament[]>([
    {
      id: '1',
      name: 'Cyber Championship 2024',
      date: new Date('2024-11-10'),
      participants: 128,
      winner: 'CyberMaster',
      winnerRole: 'hacker',
      winnerScore: 420
    },
    {
      id: '2',
      name: 'Detective Masters Cup',
      date: new Date('2024-11-05'),
      participants: 96,
      winner: 'DetectiveElite',
      winnerRole: 'detective',
      winnerScore: 380
    },
    {
      id: '3',
      name: 'Code Breakers Battle',
      date: new Date('2024-10-28'),
      participants: 64,
      winner: 'CodeNinja',
      winnerRole: 'hacker',
      winnerScore: 390
    },
    {
      id: '4',
      name: 'Logic Puzzle Championship',
      date: new Date('2024-10-20'),
      participants: 80,
      winner: 'SherlockDev',
      winnerRole: 'detective',
      winnerScore: 350
    }
  ]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <span className="font-heading font-bold text-textprimary">#{rank}</span>;
    }
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    return <div className="w-4 h-4" />;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredLeaderboard = globalLeaderboard.filter(entry => {
    if (roleFilter !== 'all' && entry.role !== roleFilter) return false;
    // Add time filtering logic here if needed
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-secondary border-b border-primary/20">
        <div className="flex items-center space-x-2">
          <Terminal className="h-8 w-8 text-primary" />
          <span className="text-xl font-heading font-bold text-secondary-foreground">LEADERBOARD</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="font-paragraph">
            <Trophy className="mr-1 h-3 w-3" />
            Global Rankings
          </Badge>
          <Button asChild variant="outline" size="sm">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="global" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="global" className="font-paragraph">Global Leaderboard</TabsTrigger>
            <TabsTrigger value="tournaments" className="font-paragraph">Tournament History</TabsTrigger>
            <TabsTrigger value="stats" className="font-paragraph">Statistics</TabsTrigger>
          </TabsList>

          {/* Global Leaderboard */}
          <TabsContent value="global" className="space-y-6">
            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="font-paragraph text-sm text-textprimary/70">Time Period:</span>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">All Time</SelectItem>
                    <SelectItem value="monthly">This Month</SelectItem>
                    <SelectItem value="weekly">This Week</SelectItem>
                    <SelectItem value="daily">Today</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="font-paragraph text-sm text-textprimary/70">Role:</span>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="hacker">Hackers</SelectItem>
                    <SelectItem value="detective">Detectives</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {filteredLeaderboard.slice(0, 3).map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative ${index === 0 ? 'md:order-2' : index === 1 ? 'md:order-1' : 'md:order-3'}`}
                >
                  <Card className={`p-6 text-center ${
                    index === 0 ? 'bg-gradient-to-b from-yellow-50 to-background border-yellow-200' :
                    index === 1 ? 'bg-gradient-to-b from-gray-50 to-background border-gray-200' :
                    'bg-gradient-to-b from-amber-50 to-background border-amber-200'
                  }`}>
                    <div className="mb-4">
                      {getRankIcon(player.rank)}
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-xl font-heading font-bold text-textprimary mb-1">
                        {player.username}
                      </h3>
                      <div className="flex items-center justify-center space-x-1">
                        {player.role === 'hacker' ? (
                          <Code className="h-4 w-4 text-primary" />
                        ) : (
                          <Shield className="h-4 w-4 text-primary" />
                        )}
                        <span className="font-paragraph text-sm text-textprimary/70 capitalize">
                          {player.role}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-3xl font-heading font-bold text-primary">
                        {player.score.toLocaleString()}
                      </div>
                      <div className="font-paragraph text-sm text-textprimary/70">Total Score</div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-paragraph">
                        <div>
                          <div className="font-semibold text-textprimary">{player.gamesWon}/{player.gamesPlayed}</div>
                          <div className="text-textprimary/70">Win Rate</div>
                        </div>
                        <div>
                          <div className="font-semibold text-textprimary">{player.bestScore}</div>
                          <div className="text-textprimary/70">Best Score</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Full Leaderboard */}
            <Card className="p-6">
              <h3 className="text-xl font-heading font-semibold text-textprimary mb-4">
                Complete Rankings
              </h3>
              
              <div className="space-y-2">
                {filteredLeaderboard.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-secondary/10 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 text-center">
                        {getRankIcon(player.rank)}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getRankChangeIcon(player.rankChange)}
                        {player.rankChange !== 0 && (
                          <span className={`text-xs font-paragraph ${
                            player.rankChange > 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {Math.abs(player.rankChange)}
                          </span>
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-heading font-semibold text-textprimary">
                            {player.username}
                          </span>
                          <Badge variant="outline" className="font-paragraph text-xs">
                            {player.role === 'hacker' ? (
                              <><Code className="mr-1 h-3 w-3" /> HACKER</>
                            ) : (
                              <><Shield className="mr-1 h-3 w-3" /> DETECTIVE</>
                            )}
                          </Badge>
                        </div>
                        <div className="font-paragraph text-sm text-textprimary/70">
                          {player.gamesPlayed} games • {Math.round((player.gamesWon / player.gamesPlayed) * 100)}% win rate
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-8">
                      <div className="text-right">
                        <div className="font-heading font-bold text-textprimary">
                          {player.score.toLocaleString()}
                        </div>
                        <div className="font-paragraph text-xs text-textprimary/70">Total Score</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-heading font-semibold text-textprimary">
                          {player.averageScore}
                        </div>
                        <div className="font-paragraph text-xs text-textprimary/70">Avg Score</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-heading font-semibold text-textprimary">
                          {formatTime(player.totalTime)}
                        </div>
                        <div className="font-paragraph text-xs text-textprimary/70">Total Time</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Tournament History */}
          <TabsContent value="tournaments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recentTournaments.map((tournament, index) => (
                <motion.div
                  key={tournament.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-heading font-semibold text-textprimary mb-1">
                          {tournament.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm font-paragraph text-textprimary/70">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(tournament.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{tournament.participants} players</span>
                          </div>
                        </div>
                      </div>
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="bg-secondary p-4 rounded border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Crown className="h-5 w-5 text-yellow-500" />
                          <span className="font-heading font-semibold text-secondary-foreground">
                            {tournament.winner}
                          </span>
                          <Badge variant="outline" className="font-paragraph text-xs">
                            {tournament.winnerRole === 'hacker' ? (
                              <><Code className="mr-1 h-3 w-3" /> HACKER</>
                            ) : (
                              <><Shield className="mr-1 h-3 w-3" /> DETECTIVE</>
                            )}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-heading font-bold text-primary">
                            {tournament.winnerScore}
                          </div>
                          <div className="font-paragraph text-xs text-secondary-foreground/70">
                            Final Score
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-heading font-bold text-textprimary">
                  {globalLeaderboard.length}
                </div>
                <div className="font-paragraph text-sm text-textprimary/70">Active Players</div>
              </Card>
              
              <Card className="p-6 text-center">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-heading font-bold text-textprimary">
                  {recentTournaments.length}
                </div>
                <div className="font-paragraph text-sm text-textprimary/70">Tournaments Held</div>
              </Card>
              
              <Card className="p-6 text-center">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-heading font-bold text-textprimary">
                  {globalLeaderboard.reduce((sum, p) => sum + p.gamesPlayed, 0)}
                </div>
                <div className="font-paragraph text-sm text-textprimary/70">Total Games</div>
              </Card>
              
              <Card className="p-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-heading font-bold text-textprimary">
                  {Math.round(globalLeaderboard.reduce((sum, p) => sum + p.totalTime, 0) / 3600)}h
                </div>
                <div className="font-paragraph text-sm text-textprimary/70">Total Playtime</div>
              </Card>
            </div>

            {/* Role Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-heading font-semibold text-textprimary mb-4">
                  Role Distribution
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Code className="h-5 w-5 text-primary" />
                      <span className="font-paragraph text-textprimary">Hackers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(globalLeaderboard.filter(p => p.role === 'hacker').length / globalLeaderboard.length) * 100}%` }}
                        />
                      </div>
                      <span className="font-paragraph text-sm text-textprimary">
                        {globalLeaderboard.filter(p => p.role === 'hacker').length}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <span className="font-paragraph text-textprimary">Detectives</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(globalLeaderboard.filter(p => p.role === 'detective').length / globalLeaderboard.length) * 100}%` }}
                        />
                      </div>
                      <span className="font-paragraph text-sm text-textprimary">
                        {globalLeaderboard.filter(p => p.role === 'detective').length}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-heading font-semibold text-textprimary mb-4">
                  Top Performers
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-paragraph text-textprimary/70">Highest Score</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-heading font-semibold text-textprimary">
                        {Math.max(...globalLeaderboard.map(p => p.bestScore))}
                      </span>
                      <Star className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-paragraph text-textprimary/70">Best Win Rate</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-heading font-semibold text-textprimary">
                        {Math.max(...globalLeaderboard.map(p => Math.round((p.gamesWon / p.gamesPlayed) * 100)))}%
                      </span>
                      <Star className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-paragraph text-textprimary/70">Most Games</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-heading font-semibold text-textprimary">
                        {Math.max(...globalLeaderboard.map(p => p.gamesPlayed))}
                      </span>
                      <Star className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}