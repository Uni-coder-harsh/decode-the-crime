import { useEffect, useCallback } from 'react';
import { socketService } from '@/services/socketService';
import { useGameStore } from '@/store/gameStore';

export const useSocket = () => {
  const {
    setConnectionStatus,
    updateLeaderboard,
    updatePlayerScore,
    setGameStatus,
    setTimeRemaining
  } = useGameStore();

  // Initialize socket connection
  useEffect(() => {
    socketService.connect();

    // Connection status listener
    socketService.onConnection((connected) => {
      setConnectionStatus(connected ? 'connected' : 'disconnected');
    });

    // Game event listeners
    socketService.on('room-joined', (data) => {
      console.log('Room joined:', data);
    });

    socketService.on('player-joined', (data) => {
      console.log('Player joined:', data);
    });

    socketService.on('player-left', (data) => {
      console.log('Player left:', data);
    });

    socketService.on('game-started', (data) => {
      setGameStatus('active');
      setTimeRemaining(data.timeLimit || 2700); // 45 minutes default
    });

    socketService.on('game-paused', () => {
      setGameStatus('paused');
    });

    socketService.on('game-ended', () => {
      setGameStatus('finished');
    });

    socketService.on('leaderboard-update', (data) => {
      updateLeaderboard(data.leaderboard);
    });

    socketService.on('score-update', (data) => {
      updatePlayerScore(data.playerId, data.score);
    });

    socketService.on('code-result', (data) => {
      console.log('Code submission result:', data);
    });

    socketService.on('puzzle-result', (data) => {
      console.log('Puzzle submission result:', data);
    });

    socketService.on('accusation-result', (data) => {
      console.log('Accusation result:', data);
    });

    socketService.on('timer-update', (data) => {
      setTimeRemaining(data.timeRemaining);
    });

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [setConnectionStatus, updateLeaderboard, updatePlayerScore, setGameStatus, setTimeRemaining]);

  // Socket action methods
  const joinRoom = useCallback((roomId: string, playerData: any) => {
    socketService.joinRoom(roomId, playerData);
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    socketService.leaveRoom(roomId);
  }, []);

  const submitCode = useCallback((code: string, taskId: string, points: number) => {
    socketService.submitCode(code, taskId, points);
  }, []);

  const submitPuzzle = useCallback((answer: string, puzzleId: string, points: number) => {
    socketService.submitPuzzle(answer, puzzleId, points);
  }, []);

  const makeAccusation = useCallback((target: string, accuser: string) => {
    socketService.makeAccusation(target, accuser);
  }, []);

  const readyUp = useCallback((playerId: string, isReady: boolean) => {
    socketService.readyUp(playerId, isReady);
  }, []);

  const startGame = useCallback((roomId: string) => {
    socketService.startGame(roomId);
  }, []);

  const pauseGame = useCallback((roomId: string) => {
    socketService.pauseGame(roomId);
  }, []);

  const endGame = useCallback((roomId: string) => {
    socketService.endGame(roomId);
  }, []);

  return {
    joinRoom,
    leaveRoom,
    submitCode,
    submitPuzzle,
    makeAccusation,
    readyUp,
    startGame,
    pauseGame,
    endGame,
    isConnected: socketService.getConnectionStatus()
  };
};