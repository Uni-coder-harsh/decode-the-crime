import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BaseCrudService } from '@/integrations';
import { GameRooms, PlayerProfiles } from '@/entities';
import { Users, Lock, Unlock, Plus, Gamepad2, Crown } from 'lucide-react';

export default function LobbyPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<GameRooms[]>([]);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfiles | null>(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [isPrivate, setIsPrivate] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [showJoinPrivate, setShowJoinPrivate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load available rooms from database
      const { items: roomItems } = await BaseCrudService.getAll<GameRooms>('gamerooms');
      setRooms(roomItems.filter(room => room.roomStatus === 'waiting'));

      // Get or create player profile using real database
      const username = localStorage.getItem('playerUsername') || 'Anonymous';
      localStorage.setItem('playerUsername', username);
      
      const { items: profiles } = await BaseCrudService.getAll<PlayerProfiles>('playerprofiles');
      let profile = profiles.find(p => p.username === username);
      
      if (!profile) {
        profile = await BaseCrudService.create<PlayerProfiles>('playerprofiles', {
          _id: crypto.randomUUID(),
          username,
          currentRank: 1000,
          totalWins: 0,
          totalLosses: 0,
          gamesPlayed: 0,
          achievementsUnlocked: 'Newcomer'
        });
      }
      
      setPlayerProfile(profile);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      const roomCode = isPrivate ? Math.random().toString(36).substring(2, 8).toUpperCase() : '';
      
      await BaseCrudService.create<GameRooms>('gamerooms', {
        _id: crypto.randomUUID(),
        roomName: newRoomName,
        roomStatus: 'waiting',
        maxPlayers,
        currentPlayers: 0,
        joinCode: roomCode,
        isPrivate,
        creationTime: new Date()
      });

      setShowCreateRoom(false);
      setNewRoomName('');
      loadData();
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const joinRoom = async (room: GameRooms) => {
    try {
      // Update room player count
      await BaseCrudService.update<GameRooms>('gamerooms', {
        _id: room._id,
        currentPlayers: (room.currentPlayers || 0) + 1
      });

      // Navigate to game with room info
      navigate('/game', { state: { roomId: room._id, roomName: room.roomName } });
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const joinPrivateRoom = async () => {
    if (!joinCode.trim()) return;

    try {
      const { items: rooms } = await BaseCrudService.getAll<GameRooms>('gamerooms');
      const room = rooms.find(r => r.joinCode === joinCode.toUpperCase() && r.roomStatus === 'waiting');
      
      if (room) {
        await joinRoom(room);
      } else {
        alert('Invalid room code or room not available');
      }
    } catch (error) {
      console.error('Error joining private room:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-neon-green text-xl neon-text">Loading...</div>
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
              DECODE WARS LOBBY
            </h1>
            <p className="text-neon-blue">
              Welcome, {playerProfile?.username} | Rank: {playerProfile?.currentRank}
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate('/leaderboard')}
              className="bg-neon-purple text-white hover:bg-neon-purple/80 neon-glow"
            >
              <Crown className="w-4 h-4 mr-2" />
              Leaderboard
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-neon-green text-neon-green hover:bg-neon-green hover:text-black"
            >
              Exit
            </Button>
          </div>
        </div>

        {/* Player Stats */}
        <Card className="bg-dark-card border-neon-green/30 mb-8">
          <CardHeader>
            <CardTitle className="text-neon-green">Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-green">{playerProfile?.gamesPlayed || 0}</div>
                <div className="text-gray-400">Games Played</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-blue">{playerProfile?.totalWins || 0}</div>
                <div className="text-gray-400">Wins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{playerProfile?.totalLosses || 0}</div>
                <div className="text-gray-400">Losses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-purple">{playerProfile?.currentRank || 1000}</div>
                <div className="text-gray-400">Rank Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Actions */}
        <div className="flex gap-4 mb-8">
          <Dialog open={showCreateRoom} onOpenChange={setShowCreateRoom}>
            <DialogTrigger asChild>
              <Button className="bg-neon-green text-black hover:bg-neon-green/80 neon-glow">
                <Plus className="w-4 h-4 mr-2" />
                Create Room
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-card border-neon-green text-neon-green">
              <DialogHeader>
                <DialogTitle className="neon-text">Create New Room</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Room Name</label>
                  <Input
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Enter room name..."
                    className="bg-dark-bg border-neon-green/50 text-neon-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Players</label>
                  <Input
                    type="number"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(parseInt(e.target.value) || 4)}
                    min={2}
                    max={8}
                    className="bg-dark-bg border-neon-green/50 text-neon-green"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="private"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded border-neon-green"
                  />
                  <label htmlFor="private" className="text-sm">Private Room</label>
                </div>
                <Button onClick={createRoom} className="w-full bg-neon-green text-black hover:bg-neon-green/80">
                  Create Room
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showJoinPrivate} onOpenChange={setShowJoinPrivate}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black">
                <Lock className="w-4 h-4 mr-2" />
                Join Private
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-dark-card border-neon-blue text-neon-green">
              <DialogHeader>
                <DialogTitle className="neon-text">Join Private Room</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Room Code</label>
                  <Input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter 6-digit code..."
                    className="bg-dark-bg border-neon-blue/50 text-neon-green"
                  />
                </div>
                <Button onClick={joinPrivateRoom} className="w-full bg-neon-blue text-black hover:bg-neon-blue/80">
                  Join Room
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Available Rooms */}
        <div>
          <h2 className="text-2xl font-bold text-neon-green mb-4 neon-text">Available Rooms</h2>
          {rooms.length === 0 ? (
            <Card className="bg-dark-card border-neon-green/30">
              <CardContent className="p-8 text-center">
                <Gamepad2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No rooms available. Create one to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <Card key={room._id} className="bg-dark-card border-neon-green/30 hover:border-neon-green transition-all duration-300 hover:neon-glow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-neon-green">{room.roomName}</CardTitle>
                      {room.isPrivate ? (
                        <Lock className="w-5 h-5 text-neon-purple" />
                      ) : (
                        <Unlock className="w-5 h-5 text-neon-blue" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Players:</span>
                        <Badge variant="outline" className="border-neon-blue text-neon-blue">
                          <Users className="w-3 h-3 mr-1" />
                          {room.currentPlayers || 0}/{room.maxPlayers}
                        </Badge>
                      </div>
                      {room.isPrivate && room.joinCode && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Code:</span>
                          <span className="text-neon-purple font-mono">{room.joinCode}</span>
                        </div>
                      )}
                      <Button 
                        onClick={() => joinRoom(room)}
                        disabled={(room.currentPlayers || 0) >= (room.maxPlayers || 4)}
                        className="w-full bg-neon-green text-black hover:bg-neon-green/80 disabled:bg-gray-600 disabled:text-gray-400"
                      >
                        {(room.currentPlayers || 0) >= (room.maxPlayers || 4) ? 'Room Full' : 'Join Room'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}