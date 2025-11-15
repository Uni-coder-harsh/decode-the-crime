import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Users, 
  Clock, 
  Shield, 
  Code, 
  Play, 
  Settings,
  UserCheck,
  Crown,
  Wifi
} from 'lucide-react';

interface Room {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  status: 'waiting' | 'starting' | 'in-progress' | 'finished';
  gameMode: 'classic' | 'blitz' | 'tournament';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
}

interface Player {
  id: string;
  username: string;
  role?: 'hacker' | 'detective';
  isReady: boolean;
  isHost: boolean;
}

export default function LobbyPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [roomPlayers, setRoomPlayers] = useState<Player[]>([]);
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      name: 'Cyber Heist Championship',
      players: 8,
      maxPlayers: 12,
      status: 'waiting',
      gameMode: 'classic',
      difficulty: 'hard',
      estimatedTime: 45
    },
    {
      id: '2',
      name: 'Quick Code Battle',
      players: 4,
      maxPlayers: 8,
      status: 'waiting',
      gameMode: 'blitz',
      difficulty: 'medium',
      estimatedTime: 15
    },
    {
      id: '3',
      name: 'Detective Training',
      players: 2,
      maxPlayers: 6,
      status: 'starting',
      gameMode: 'classic',
      difficulty: 'easy',
      estimatedTime: 30
    },
    {
      id: '4',
      name: 'Elite Hackers Only',
      players: 10,
      maxPlayers: 16,
      status: 'in-progress',
      gameMode: 'tournament',
      difficulty: 'hard',
      estimatedTime: 60
    }
  ]);

  useEffect(() => {
    // Simulate WebSocket connection
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Simulate room players when a room is selected
    if (selectedRoom) {
      const mockPlayers: Player[] = [
        { id: '1', username: 'CyberNinja', role: 'hacker' as const, isReady: true, isHost: true },
        { id: '2', username: 'DetectiveX', role: 'detective' as const, isReady: true, isHost: false },
        { id: '3', username: 'CodeBreaker', role: 'hacker' as const, isReady: false, isHost: false },
        { id: '4', username: 'SherlockDev', role: 'detective' as const, isReady: true, isHost: false },
      ].slice(0, selectedRoom.players);
      setRoomPlayers(mockPlayers);
    }
  }, [selectedRoom]);

  const handleJoinRoom = (room: Room) => {
    if (room.status === 'in-progress' || room.players >= room.maxPlayers) return;
    
    setSelectedRoom(room);
    setCurrentPlayer({
      id: 'current-user',
      username: playerName || 'Anonymous',
      isReady: false,
      isHost: false
    });
  };

  const handleLeaveRoom = () => {
    setSelectedRoom(null);
    setCurrentPlayer(null);
    setRoomPlayers([]);
  };

  const handleToggleReady = () => {
    if (currentPlayer) {
      setCurrentPlayer({ ...currentPlayer, isReady: !currentPlayer.isReady });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-green-500';
      case 'starting': return 'bg-yellow-500';
      case 'in-progress': return 'bg-red-500';
      case 'finished': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (!selectedRoom) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-background border-b border-primary/20">
          <div className="flex items-center space-x-2">
            <Terminal className="h-8 w-8 text-primary" />
            <span className="text-xl font-heading font-bold text-textprimary">DECODE THE CRIME</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-paragraph text-sm text-textprimary">
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6">
          {/* Player Setup */}
          <div className="mb-8">
            <Card className="p-6 bg-secondary border-primary/20">
              <h2 className="text-2xl font-heading font-bold text-secondary-foreground mb-4">
                Join the Competition
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                <Input
                  placeholder="Enter your username"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="font-paragraph"
                />
                <Button 
                  disabled={!playerName.trim() || !isConnected}
                  className="font-paragraph"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Set Username
                </Button>
              </div>
            </Card>
          </div>

          {/* Room List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-heading font-bold text-textprimary">
                Active Rooms
              </h2>
              <Button asChild variant="outline">
                <Link to="/admin">
                  <Settings className="mr-2 h-4 w-4" />
                  Create Room
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {rooms.map((room) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 hover:border-primary/40 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-heading font-semibold text-textprimary mb-2">
                          {room.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm font-paragraph text-textprimary/70">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{room.players}/{room.maxPlayers}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{room.estimatedTime}m</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(room.status)}`} />
                        <Badge variant="outline" className="font-paragraph text-xs">
                          {room.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Badge variant="secondary" className="font-paragraph">
                          {room.gameMode.toUpperCase()}
                        </Badge>
                        <span className={`font-paragraph text-sm font-semibold ${getDifficultyColor(room.difficulty)}`}>
                          {room.difficulty.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleJoinRoom(room)}
                      disabled={room.status === 'in-progress' || room.players >= room.maxPlayers || !playerName.trim()}
                      className="w-full font-paragraph"
                      variant={room.status === 'waiting' ? 'default' : 'secondary'}
                    >
                      {room.status === 'in-progress' ? (
                        <>
                          <Wifi className="mr-2 h-4 w-4" />
                          In Progress
                        </>
                      ) : room.players >= room.maxPlayers ? (
                        'Room Full'
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Join Room
                        </>
                      )}
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Room View
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-background border-b border-primary/20">
        <div className="flex items-center space-x-2">
          <Terminal className="h-8 w-8 text-primary" />
          <span className="text-xl font-heading font-bold text-textprimary">DECODE THE CRIME</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="font-paragraph">
            Room: {selectedRoom.name}
          </Badge>
          <Button onClick={handleLeaveRoom} variant="outline" size="sm">
            Leave Room
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Room Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-secondary border-primary/20">
              <h2 className="text-2xl font-heading font-bold text-secondary-foreground mb-4">
                {selectedRoom.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-heading font-bold text-primary">
                    {selectedRoom.players}/{selectedRoom.maxPlayers}
                  </div>
                  <div className="font-paragraph text-sm text-secondary-foreground/70">Players</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-heading font-bold text-primary">
                    {selectedRoom.estimatedTime}m
                  </div>
                  <div className="font-paragraph text-sm text-secondary-foreground/70">Duration</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-heading font-bold ${getDifficultyColor(selectedRoom.difficulty)}`}>
                    {selectedRoom.difficulty.toUpperCase()}
                  </div>
                  <div className="font-paragraph text-sm text-secondary-foreground/70">Difficulty</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-heading font-bold text-primary">
                    {selectedRoom.gameMode.toUpperCase()}
                  </div>
                  <div className="font-paragraph text-sm text-secondary-foreground/70">Mode</div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-heading font-semibold text-secondary-foreground">
                  Game Rules
                </h3>
                <ul className="space-y-2 font-paragraph text-sm text-secondary-foreground/80">
                  <li>• Hackers solve coding challenges to gain points</li>
                  <li>• Detectives solve logic puzzles and can make accusations</li>
                  <li>• Real-time leaderboard tracks all player progress</li>
                  <li>• Anti-cheat system monitors all submissions</li>
                  <li>• Game ends when time runs out or all puzzles are solved</li>
                </ul>
              </div>
            </Card>

            {/* Players List */}
            <Card className="p-6">
              <h3 className="text-xl font-heading font-semibold text-textprimary mb-4">
                Players ({roomPlayers.length + (currentPlayer ? 1 : 0)}/{selectedRoom.maxPlayers})
              </h3>
              <div className="space-y-3">
                {/* Current Player */}
                {currentPlayer && (
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-heading font-bold text-sm">
                          {currentPlayer.username[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-heading font-semibold text-textprimary">
                            {currentPlayer.username} (You)
                          </span>
                          {currentPlayer.role && (
                            <Badge variant="outline" className="font-paragraph text-xs">
                              {currentPlayer.role === 'hacker' ? (
                                <><Code className="mr-1 h-3 w-3" /> HACKER</>
                              ) : (
                                <><Shield className="mr-1 h-3 w-3" /> DETECTIVE</>
                              )}
                            </Badge>
                          )}
                        </div>
                        <div className="font-paragraph text-sm text-textprimary/70">
                          {currentPlayer.isReady ? 'Ready' : 'Not Ready'}
                        </div>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${currentPlayer.isReady ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  </div>
                )}

                {/* Other Players */}
                {roomPlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        {player.isHost && <Crown className="h-4 w-4 text-primary" />}
                        {!player.isHost && (
                          <span className="text-secondary-foreground font-heading font-bold text-sm">
                            {player.username[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-heading font-semibold text-textprimary">
                            {player.username}
                          </span>
                          {player.isHost && (
                            <Badge variant="default" className="font-paragraph text-xs">
                              HOST
                            </Badge>
                          )}
                          {player.role && (
                            <Badge variant="outline" className="font-paragraph text-xs">
                              {player.role === 'hacker' ? (
                                <><Code className="mr-1 h-3 w-3" /> HACKER</>
                              ) : (
                                <><Shield className="mr-1 h-3 w-3" /> DETECTIVE</>
                              )}
                            </Badge>
                          )}
                        </div>
                        <div className="font-paragraph text-sm text-textprimary/70">
                          {player.isReady ? 'Ready' : 'Not Ready'}
                        </div>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${player.isReady ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-heading font-semibold text-textprimary mb-4">
                Player Controls
              </h3>
              <div className="space-y-4">
                <Button
                  onClick={handleToggleReady}
                  className="w-full font-paragraph"
                  variant={currentPlayer?.isReady ? 'secondary' : 'default'}
                >
                  {currentPlayer?.isReady ? 'Cancel Ready' : 'Ready Up'}
                </Button>
                
                <Button asChild variant="outline" className="w-full font-paragraph">
                  <Link to="/game">
                    <Play className="mr-2 h-4 w-4" />
                    Start Game (Demo)
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-secondary border-primary/20">
              <h3 className="text-lg font-heading font-semibold text-secondary-foreground mb-4">
                Connection Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-paragraph text-sm text-secondary-foreground/70">Server</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="font-paragraph text-sm text-secondary-foreground">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-paragraph text-sm text-secondary-foreground/70">Ping</span>
                  <span className="font-paragraph text-sm text-secondary-foreground">23ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-paragraph text-sm text-secondary-foreground/70">Players Online</span>
                  <span className="font-paragraph text-sm text-secondary-foreground">247</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}