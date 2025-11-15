import { create } from 'zustand';

interface Player {
  id: string;
  username: string;
  role: 'hacker' | 'detective';
  score: number;
  isOnline: boolean;
  isReady: boolean;
}

interface Room {
  id: string;
  name: string;
  maxPlayers: number;
  currentPlayers: number;
  status: 'waiting' | 'starting' | 'active' | 'finished';
  gameMode: 'classic' | 'blitz' | 'tournament';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GameState {
  // Connection
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  
  // Player
  currentPlayer: Player | null;
  
  // Room
  currentRoom: Room | null;
  roomPlayers: Player[];
  
  // Game
  gameStatus: 'waiting' | 'active' | 'paused' | 'finished';
  timeRemaining: number;
  currentRound: number;
  totalRounds: number;
  
  // Leaderboard
  leaderboard: Player[];
  
  // Actions
  setConnectionStatus: (status: 'connecting' | 'connected' | 'disconnected') => void;
  setCurrentPlayer: (player: Player | null) => void;
  setCurrentRoom: (room: Room | null) => void;
  setRoomPlayers: (players: Player[]) => void;
  setGameStatus: (status: 'waiting' | 'active' | 'paused' | 'finished') => void;
  setTimeRemaining: (time: number) => void;
  updateLeaderboard: (leaderboard: Player[]) => void;
  updatePlayerScore: (playerId: string, score: number) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  isConnected: false,
  connectionStatus: 'disconnected',
  currentPlayer: null,
  currentRoom: null,
  roomPlayers: [],
  gameStatus: 'waiting',
  timeRemaining: 0,
  currentRound: 1,
  totalRounds: 3,
  leaderboard: [],

  // Actions
  setConnectionStatus: (status) => {
    set({ 
      connectionStatus: status,
      isConnected: status === 'connected'
    });
  },

  setCurrentPlayer: (player) => {
    set({ currentPlayer: player });
  },

  setCurrentRoom: (room) => {
    set({ currentRoom: room });
  },

  setRoomPlayers: (players) => {
    set({ roomPlayers: players });
  },

  setGameStatus: (status) => {
    set({ gameStatus: status });
  },

  setTimeRemaining: (time) => {
    set({ timeRemaining: time });
  },

  updateLeaderboard: (leaderboard) => {
    set({ leaderboard });
  },

  updatePlayerScore: (playerId, score) => {
    const { leaderboard, roomPlayers } = get();
    
    // Update leaderboard
    const updatedLeaderboard = leaderboard.map(player =>
      player.id === playerId ? { ...player, score } : player
    );
    
    // Update room players
    const updatedRoomPlayers = roomPlayers.map(player =>
      player.id === playerId ? { ...player, score } : player
    );
    
    set({ 
      leaderboard: updatedLeaderboard,
      roomPlayers: updatedRoomPlayers
    });
  },
}));