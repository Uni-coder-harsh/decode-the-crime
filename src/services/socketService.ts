// Socket.IO service for real-time communication
// This is a mock implementation since we don't have a backend server

interface SocketEvent {
  type: string;
  data: any;
}

interface SocketListener {
  event: string;
  callback: (data: any) => void;
}

class SocketService {
  private listeners: SocketListener[] = [];
  private isConnected = false;
  private connectionCallbacks: Array<(connected: boolean) => void> = [];

  // Mock connection
  connect() {
    setTimeout(() => {
      this.isConnected = true;
      this.connectionCallbacks.forEach(callback => callback(true));
      this.emit('connected', { status: 'connected' });
    }, 1000);
  }

  disconnect() {
    this.isConnected = false;
    this.connectionCallbacks.forEach(callback => callback(false));
    this.emit('disconnected', { status: 'disconnected' });
  }

  // Event listeners
  on(event: string, callback: (data: any) => void) {
    this.listeners.push({ event, callback });
  }

  off(event: string, callback?: (data: any) => void) {
    if (callback) {
      this.listeners = this.listeners.filter(
        listener => !(listener.event === event && listener.callback === callback)
      );
    } else {
      this.listeners = this.listeners.filter(listener => listener.event !== event);
    }
  }

  // Emit events (mock)
  emit(event: string, data: any) {
    // In a real implementation, this would send data to the server
    console.log(`[Socket] Emitting ${event}:`, data);
    
    // Mock server responses
    this.mockServerResponse(event, data);
  }

  // Mock server responses for demonstration
  private mockServerResponse(event: string, data: any) {
    setTimeout(() => {
      switch (event) {
        case 'join-room':
          this.triggerEvent('room-joined', {
            room: data.room,
            players: [
              { id: '1', username: 'CyberNinja', role: 'hacker', score: 0, isOnline: true, isReady: false },
              { id: '2', username: 'DetectiveX', role: 'detective', score: 0, isOnline: true, isReady: true },
            ]
          });
          break;
          
        case 'submit-code':
          const isCorrect = Math.random() > 0.3; // 70% success rate
          this.triggerEvent('code-result', {
            success: isCorrect,
            score: isCorrect ? data.points : 0,
            message: isCorrect ? 'Solution accepted!' : 'Wrong answer. Try again.'
          });
          break;
          
        case 'submit-puzzle':
          const puzzleCorrect = data.answer.toLowerCase().includes('sql injection');
          this.triggerEvent('puzzle-result', {
            success: puzzleCorrect,
            score: puzzleCorrect ? data.points : 0,
            message: puzzleCorrect ? 'Correct answer!' : 'Incorrect. Think about web vulnerabilities.'
          });
          break;
          
        case 'make-accusation':
          this.triggerEvent('accusation-result', {
            success: Math.random() > 0.5,
            target: data.target,
            accuser: data.accuser
          });
          break;
          
        case 'ready-up':
          this.triggerEvent('player-ready', {
            playerId: data.playerId,
            isReady: data.isReady
          });
          break;
          
        default:
          break;
      }
    }, Math.random() * 1000 + 500); // Random delay 500-1500ms
  }

  // Trigger events for listeners
  private triggerEvent(event: string, data: any) {
    this.listeners
      .filter(listener => listener.event === event)
      .forEach(listener => listener.callback(data));
  }

  // Connection status
  onConnection(callback: (connected: boolean) => void) {
    this.connectionCallbacks.push(callback);
    // Immediately call with current status
    callback(this.isConnected);
  }

  getConnectionStatus() {
    return this.isConnected;
  }

  // Room management
  joinRoom(roomId: string, playerData: any) {
    this.emit('join-room', { roomId, player: playerData });
  }

  leaveRoom(roomId: string) {
    this.emit('leave-room', { roomId });
  }

  // Game actions
  submitCode(code: string, taskId: string, points: number) {
    this.emit('submit-code', { code, taskId, points });
  }

  submitPuzzle(answer: string, puzzleId: string, points: number) {
    this.emit('submit-puzzle', { answer, puzzleId, points });
  }

  makeAccusation(target: string, accuser: string) {
    this.emit('make-accusation', { target, accuser });
  }

  readyUp(playerId: string, isReady: boolean) {
    this.emit('ready-up', { playerId, isReady });
  }

  // Admin actions
  startGame(roomId: string) {
    this.emit('start-game', { roomId });
  }

  pauseGame(roomId: string) {
    this.emit('pause-game', { roomId });
  }

  endGame(roomId: string) {
    this.emit('end-game', { roomId });
  }
}

// Export singleton instance
export const socketService = new SocketService();