import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseCrudService } from '@/integrations';
import { PlayerProfiles, GameRecords } from '@/entities';
import { Trophy, Medal, Crown, Users, Target, TrendingUp, Terminal, Code, Shield, Calendar, Clock, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<PlayerProfiles[]>([]);
  const [gameRecords, setGameRecords] = useState<GameRecords[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { items: playerItems } = await BaseCrudService.getAll<PlayerProfiles>('playerprofiles');
      const { items: recordItems } = await BaseCrudService.getAll<GameRecords>('gamerecords');
      
      // Sort players by rank (higher rank = better)
      const sortedPlayers = playerItems.sort((a, b) => (b.currentRank || 0) - (a.currentRank || 0));
      
      setPlayers(sortedPlayers);
      setGameRecords(recordItems);
    } catch (error) {
      console.error('Error loading leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <Trophy className="w-6 h-6 text-neon-blue" />;
    }
  };

  const getWinRate = (player: PlayerProfiles) => {
    const totalGames = player.gamesPlayed || 0;
    const wins = player.totalWins || 0;
    return totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-neon-green text-xl neon-text">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg matrix-bg p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-neon-green neon-text mb-2">
              DECODE WARS LEADERBOARD
            </h1>
            <p className="text-neon-blue">Elite hackers and master detectives</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => window.location.href = '/lobby'}
              className="bg-neon-green text-black hover:bg-neon-green/80 neon-glow"
            >
              Back to Lobby
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-neon-green text-neon-green hover:bg-neon-green hover:text-black"
            >
              Home
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overall" className="space-y-6">
          <TabsList className="bg-dark-card border border-neon-green/30">
            <TabsTrigger value="overall" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">
              Overall Rankings
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-neon-blue data-[state=active]:text-black">
              Player Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-6">
            {/* Top 3 Podium */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {players.slice(0, 3).map((player, index) => (
                <Card key={player._id} className={`bg-dark-card border-2 ${
                  index === 0 ? 'border-yellow-400 neon-glow' : 
                  index === 1 ? 'border-gray-400' : 'border-amber-600'
                } transition-all duration-300`}>
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                      {getRankIcon(index + 1)}
                    </div>
                    <CardTitle className={`text-xl ${
                      index === 0 ? 'text-yellow-400' : 
                      index === 1 ? 'text-gray-400' : 'text-amber-600'
                    }`}>
                      #{index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-neon-green">{player.username}</h3>
                    <div className="text-2xl font-bold text-neon-blue">{player.currentRank || 0}</div>
                    <div className="text-sm text-gray-400">Rank Points</div>
                    <div className="flex justify-center gap-4 text-xs">
                      <span className="text-neon-green">{player.totalWins || 0}W</span>
                      <span className="text-destructive">{player.totalLosses || 0}L</span>
                      <span className="text-neon-purple">{getWinRate(player)}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Full Rankings */}
            <Card className="bg-dark-card border-neon-green/30">
              <CardHeader>
                <CardTitle className="text-neon-green neon-text">Full Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {players.map((player, index) => (
                    <div key={player._id} className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:neon-glow ${
                      index < 3 ? 'bg-neon-green/10 border-neon-green/50' : 'bg-dark-bg border-neon-blue/30'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8">
                          {index < 3 ? getRankIcon(index + 1) : (
                            <span className="text-neon-blue font-bold">#{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-neon-green">{player.username}</h3>
                          <div className="flex gap-2 text-sm text-gray-400">
                            <span>{player.gamesPlayed || 0} games</span>
                            <span>•</span>
                            <span>{getWinRate(player)}% win rate</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-neon-blue">{player.currentRank || 0}</div>
                        <div className="text-sm text-gray-400">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-dark-card border-neon-green/30">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-neon-green mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neon-green">{players.length}</div>
                  <div className="text-sm text-gray-400">Total Players</div>
                </CardContent>
              </Card>

              <Card className="bg-dark-card border-neon-blue/30">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-neon-blue mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neon-blue">
                    {gameRecords.length}
                  </div>
                  <div className="text-sm text-gray-400">Games Played</div>
                </CardContent>
              </Card>

              <Card className="bg-dark-card border-neon-purple/30">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-neon-purple mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neon-purple">
                    {Math.round(players.reduce((acc, p) => acc + (p.currentRank || 0), 0) / players.length) || 0}
                  </div>
                  <div className="text-sm text-gray-400">Avg Rank</div>
                </CardContent>
              </Card>

              <Card className="bg-dark-card border-yellow-400/30">
                <CardContent className="p-6 text-center">
                  <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-400">
                    {Math.max(...players.map(p => p.currentRank || 0))}
                  </div>
                  <div className="text-sm text-gray-400">Highest Rank</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Player Stats */}
            <Card className="bg-dark-card border-neon-green/30">
              <CardHeader>
                <CardTitle className="text-neon-green neon-text">Player Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neon-green/30">
                        <th className="text-left p-3 text-neon-green">Player</th>
                        <th className="text-center p-3 text-neon-blue">Rank</th>
                        <th className="text-center p-3 text-neon-purple">Games</th>
                        <th className="text-center p-3 text-neon-green">Wins</th>
                        <th className="text-center p-3 text-destructive">Losses</th>
                        <th className="text-center p-3 text-yellow-400">Win Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((player, index) => (
                        <tr key={player._id} className="border-b border-gray-700 hover:bg-neon-green/5">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-neon-blue">#{index + 1}</span>
                              <span className="text-neon-green font-medium">{player.username}</span>
                            </div>
                          </td>
                          <td className="text-center p-3 text-neon-blue font-bold">
                            {player.currentRank || 0}
                          </td>
                          <td className="text-center p-3 text-neon-purple">
                            {player.gamesPlayed || 0}
                          </td>
                          <td className="text-center p-3 text-neon-green">
                            {player.totalWins || 0}
                          </td>
                          <td className="text-center p-3 text-destructive">
                            {player.totalLosses || 0}
                          </td>
                          <td className="text-center p-3 text-yellow-400 font-bold">
                            {getWinRate(player)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

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