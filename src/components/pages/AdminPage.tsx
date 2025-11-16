import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { DetectivePuzzles, HackerTasks, GameRooms, PlayerProfiles, CodingEvents } from '@/entities';
import { Terminal, Plus, Users, Code, Shield, Settings, Trash2, Edit, Calendar, Eye, Play, Pause, Upload, Download, Save } from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();
  const [puzzles, setPuzzles] = useState<DetectivePuzzles[]>([]);
  const [tasks, setTasks] = useState<HackerTasks[]>([]);
  const [rooms, setRooms] = useState<GameRooms[]>([]);
  const [players, setPlayers] = useState<PlayerProfiles[]>([]);
  const [events, setEvents] = useState<CodingEvents[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showAddPuzzle, setShowAddPuzzle] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  
  const [newPuzzle, setNewPuzzle] = useState({
    puzzleTitle: '',
    question: '',
    correctAnswer: '',
    difficulty: 'medium',
    hint1: '',
    hint2: '',
    adminNotes: ''
  });

  const [newTask, setNewTask] = useState({
    taskName: '',
    description: '',
    problemStatement: '',
    boilerplateCode: '',
    testCasesJson: '',
    allowedLanguages: 'javascript,python,java',
    difficultyLevel: 2
  });

  const [newEvent, setNewEvent] = useState({
    eventName: '',
    eventDescription: '',
    eventRules: '',
    startTime: '',
    endTime: '',
    maxParticipants: 50,
    eventStatus: 'Upcoming'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [puzzleData, taskData, roomData, playerData, eventData] = await Promise.all([
        BaseCrudService.getAll<DetectivePuzzles>('detectivepuzzles'),
        BaseCrudService.getAll<HackerTasks>('hackertasks'),
        BaseCrudService.getAll<GameRooms>('gamerooms'),
        BaseCrudService.getAll<PlayerProfiles>('playerprofiles'),
        BaseCrudService.getAll<CodingEvents>('codingevents')
      ]);

      setPuzzles(puzzleData.items);
      setTasks(taskData.items);
      setRooms(roomData.items);
      setPlayers(playerData.items);
      setEvents(eventData.items);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPuzzle = async () => {
    try {
      await BaseCrudService.create<DetectivePuzzles>('detectivepuzzles', {
        _id: crypto.randomUUID(),
        ...newPuzzle
      });
      
      setShowAddPuzzle(false);
      setNewPuzzle({
        puzzleTitle: '',
        question: '',
        correctAnswer: '',
        difficulty: 'medium',
        hint1: '',
        hint2: '',
        adminNotes: ''
      });
      loadData();
    } catch (error) {
      console.error('Error adding puzzle:', error);
    }
  };

  const addTask = async () => {
    try {
      await BaseCrudService.create<HackerTasks>('hackertasks', {
        _id: crypto.randomUUID(),
        ...newTask
      });
      
      setShowAddTask(false);
      setNewTask({
        taskName: '',
        description: '',
        problemStatement: '',
        boilerplateCode: '',
        testCasesJson: '',
        allowedLanguages: 'javascript,python,java',
        difficultyLevel: 2
      });
      loadData();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const addEvent = async () => {
    try {
      await BaseCrudService.create<CodingEvents>('codingevents', {
        _id: crypto.randomUUID(),
        ...newEvent,
        startTime: new Date(newEvent.startTime),
        endTime: new Date(newEvent.endTime),
        registeredParticipants: ''
      });
      
      setShowAddEvent(false);
      setNewEvent({
        eventName: '',
        eventDescription: '',
        eventRules: '',
        startTime: '',
        endTime: '',
        maxParticipants: 50,
        eventStatus: 'Upcoming'
      });
      loadData();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const deletePuzzle = async (id: string) => {
    try {
      await BaseCrudService.delete('detectivepuzzles', id);
      loadData();
    } catch (error) {
      console.error('Error deleting puzzle:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await BaseCrudService.delete('hackertasks', id);
      loadData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-neon-green text-xl neon-text">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg matrix-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-neon-green neon-text mb-2">
              ADMIN CONTROL PANEL
            </h1>
            <p className="text-neon-blue">Manage Decode Wars platform</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate('/lobby')}
              className="bg-neon-green text-black hover:bg-neon-green/80 neon-glow"
            >
              Back to Lobby
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-neon-green text-neon-green hover:bg-neon-green hover:text-black"
            >
              Home
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-dark-card border-neon-green/30">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-neon-green mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-green">{puzzles.length}</div>
              <div className="text-sm text-gray-400">Detective Puzzles</div>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-neon-blue/30">
            <CardContent className="p-6 text-center">
              <Code className="w-8 h-8 text-neon-blue mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-blue">{tasks.length}</div>
              <div className="text-sm text-gray-400">Hacker Tasks</div>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-neon-purple/30">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-neon-purple mx-auto mb-2" />
              <div className="text-2xl font-bold text-neon-purple">{players.length}</div>
              <div className="text-sm text-gray-400">Registered Players</div>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-yellow-400/30">
            <CardContent className="p-6 text-center">
              <Settings className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">{rooms.length}</div>
              <div className="text-sm text-gray-400">Active Rooms</div>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-pink-400/30">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-pink-400">{events.length}</div>
              <div className="text-sm text-gray-400">Scheduled Events</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="puzzles" className="space-y-6">
          <TabsList className="bg-dark-card border border-neon-green/30">
            <TabsTrigger value="puzzles" className="data-[state=active]:bg-neon-green data-[state=active]:text-black">
              Detective Puzzles
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-neon-blue data-[state=active]:text-black">
              Hacker Tasks
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-neon-purple data-[state=active]:text-black">
              Events
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Players
            </TabsTrigger>
          </TabsList>

          {/* Detective Puzzles Tab */}
          <TabsContent value="puzzles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-neon-green neon-text">Detective Puzzles</h2>
              <Dialog open={showAddPuzzle} onOpenChange={setShowAddPuzzle}>
                <DialogTrigger asChild>
                  <Button className="bg-neon-green text-black hover:bg-neon-green/80 neon-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Puzzle
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-dark-card border-neon-green text-neon-green max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="neon-text">Add New Detective Puzzle</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div>
                      <Label>Puzzle Title</Label>
                      <Input
                        value={newPuzzle.puzzleTitle}
                        onChange={(e) => setNewPuzzle({...newPuzzle, puzzleTitle: e.target.value})}
                        className="bg-dark-bg border-neon-green/50 text-neon-green"
                      />
                    </div>
                    <div>
                      <Label>Question</Label>
                      <Textarea
                        value={newPuzzle.question}
                        onChange={(e) => setNewPuzzle({...newPuzzle, question: e.target.value})}
                        className="bg-dark-bg border-neon-green/50 text-neon-green"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Correct Answer</Label>
                      <Input
                        value={newPuzzle.correctAnswer}
                        onChange={(e) => setNewPuzzle({...newPuzzle, correctAnswer: e.target.value})}
                        className="bg-dark-bg border-neon-green/50 text-neon-green"
                      />
                    </div>
                    <div>
                      <Label>Difficulty</Label>
                      <Select value={newPuzzle.difficulty} onValueChange={(value) => setNewPuzzle({...newPuzzle, difficulty: value})}>
                        <SelectTrigger className="bg-dark-bg border-neon-green/50 text-neon-green">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Hint 1 (Optional)</Label>
                      <Input
                        value={newPuzzle.hint1}
                        onChange={(e) => setNewPuzzle({...newPuzzle, hint1: e.target.value})}
                        className="bg-dark-bg border-neon-green/50 text-neon-green"
                      />
                    </div>
                    <div>
                      <Label>Hint 2 (Optional)</Label>
                      <Input
                        value={newPuzzle.hint2}
                        onChange={(e) => setNewPuzzle({...newPuzzle, hint2: e.target.value})}
                        className="bg-dark-bg border-neon-green/50 text-neon-green"
                      />
                    </div>
                    <Button onClick={addPuzzle} className="w-full bg-neon-green text-black hover:bg-neon-green/80">
                      Add Puzzle
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {puzzles.map((puzzle) => (
                <Card key={puzzle._id} className="bg-dark-card border-neon-green/30 hover:border-neon-green transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-neon-green mb-2">{puzzle.puzzleTitle}</h3>
                        <p className="text-gray-300 mb-2">{puzzle.question}</p>
                        <div className="flex gap-2 mb-2">
                          <span className="text-sm text-neon-blue">Answer: {puzzle.correctAnswer}</span>
                          <span className="text-sm text-neon-purple">Difficulty: {puzzle.difficulty}</span>
                        </div>
                        {puzzle.hint1 && <p className="text-sm text-gray-400">Hint 1: {puzzle.hint1}</p>}
                        {puzzle.hint2 && <p className="text-sm text-gray-400">Hint 2: {puzzle.hint2}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => deletePuzzle(puzzle._id)}
                          variant="outline"
                          size="sm"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Hacker Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-neon-blue neon-text">Hacker Tasks</h2>
              <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
                <DialogTrigger asChild>
                  <Button className="bg-neon-blue text-black hover:bg-neon-blue/80 neon-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-dark-card border-neon-blue text-neon-green max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="neon-text">Add New Hacker Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div>
                      <Label>Task Name</Label>
                      <Input
                        value={newTask.taskName}
                        onChange={(e) => setNewTask({...newTask, taskName: e.target.value})}
                        className="bg-dark-bg border-neon-blue/50 text-neon-green"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        className="bg-dark-bg border-neon-blue/50 text-neon-green"
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>Problem Statement</Label>
                      <Textarea
                        value={newTask.problemStatement}
                        onChange={(e) => setNewTask({...newTask, problemStatement: e.target.value})}
                        className="bg-dark-bg border-neon-blue/50 text-neon-green"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Difficulty Level (1-5)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        value={newTask.difficultyLevel}
                        onChange={(e) => setNewTask({...newTask, difficultyLevel: parseInt(e.target.value) || 2})}
                        className="bg-dark-bg border-neon-blue/50 text-neon-green"
                      />
                    </div>
                    <Button onClick={addTask} className="w-full bg-neon-blue text-black hover:bg-neon-blue/80">
                      Add Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {tasks.map((task) => (
                <Card key={task._id} className="bg-dark-card border-neon-blue/30 hover:border-neon-blue transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-neon-blue mb-2">{task.taskName}</h3>
                        <p className="text-gray-300 mb-2">{task.description}</p>
                        <p className="text-sm text-gray-400 mb-2">{task.problemStatement}</p>
                        <div className="flex gap-2">
                          <span className="text-sm text-neon-purple">Difficulty: {task.difficultyLevel}/5</span>
                          <span className="text-sm text-neon-green">Languages: {task.allowedLanguages}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => deleteTask(task._id)}
                          variant="outline"
                          size="sm"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-neon-purple neon-text">Coding Events</h2>
              <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
                <DialogTrigger asChild>
                  <Button className="bg-neon-purple text-white hover:bg-neon-purple/80 neon-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-dark-card border-neon-purple text-neon-green max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="neon-text">Add New Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div>
                      <Label>Event Name</Label>
                      <Input
                        value={newEvent.eventName}
                        onChange={(e) => setNewEvent({...newEvent, eventName: e.target.value})}
                        className="bg-dark-bg border-neon-purple/50 text-neon-green"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={newEvent.eventDescription}
                        onChange={(e) => setNewEvent({...newEvent, eventDescription: e.target.value})}
                        className="bg-dark-bg border-neon-purple/50 text-neon-green"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Start Time</Label>
                      <Input
                        type="datetime-local"
                        value={newEvent.startTime}
                        onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                        className="bg-dark-bg border-neon-purple/50 text-neon-green"
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input
                        type="datetime-local"
                        value={newEvent.endTime}
                        onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                        className="bg-dark-bg border-neon-purple/50 text-neon-green"
                      />
                    </div>
                    <div>
                      <Label>Max Participants</Label>
                      <Input
                        type="number"
                        value={newEvent.maxParticipants}
                        onChange={(e) => setNewEvent({...newEvent, maxParticipants: parseInt(e.target.value) || 50})}
                        className="bg-dark-bg border-neon-purple/50 text-neon-green"
                      />
                    </div>
                    <Button onClick={addEvent} className="w-full bg-neon-purple text-white hover:bg-neon-purple/80">
                      Add Event
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {events.map((event) => (
                <Card key={event._id} className="bg-dark-card border-neon-purple/30 hover:border-neon-purple transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-neon-purple mb-2">{event.eventName}</h3>
                        <p className="text-gray-300 mb-2">{event.eventDescription}</p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-neon-blue">Start: {event.startTime ? new Date(event.startTime).toLocaleDateString() : 'TBD'}</span>
                          <span className="text-neon-green">Max: {event.maxParticipants} participants</span>
                          <span className="text-yellow-400">Status: {event.eventStatus}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Players Tab */}
          <TabsContent value="players" className="space-y-6">
            <h2 className="text-2xl font-bold text-yellow-400 neon-text">Player Management</h2>
            
            <Card className="bg-dark-card border-yellow-400/30">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-yellow-400/30">
                        <th className="text-left p-3 text-yellow-400">Username</th>
                        <th className="text-center p-3 text-neon-green">Rank</th>
                        <th className="text-center p-3 text-neon-blue">Games</th>
                        <th className="text-center p-3 text-neon-purple">Wins</th>
                        <th className="text-center p-3 text-destructive">Losses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.map((player) => (
                        <tr key={player._id} className="border-b border-gray-700 hover:bg-yellow-400/5">
                          <td className="p-3 text-yellow-400 font-medium">{player.username}</td>
                          <td className="text-center p-3 text-neon-green">{player.currentRank || 0}</td>
                          <td className="text-center p-3 text-neon-blue">{player.gamesPlayed || 0}</td>
                          <td className="text-center p-3 text-neon-purple">{player.totalWins || 0}</td>
                          <td className="text-center p-3 text-destructive">{player.totalLosses || 0}</td>
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

interface Room {
  id: string;
  name: string;
  maxPlayers: number;
  currentPlayers: number;
  status: 'waiting' | 'starting' | 'active' | 'finished';
  gameMode: 'classic' | 'blitz' | 'tournament';
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
}

interface Puzzle {
  id: string;
  title: string;
  question: string;
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hint1?: string;
  hint2?: string;
  type: 'detective' | 'hacker';
}

function AdminPageSecondary() {
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      name: 'Cyber Heist Championship',
      maxPlayers: 12,
      currentPlayers: 8,
      status: 'active',
      gameMode: 'classic',
      difficulty: 'hard',
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Quick Code Battle',
      maxPlayers: 8,
      currentPlayers: 4,
      status: 'waiting',
      gameMode: 'blitz',
      difficulty: 'medium',
      createdAt: new Date()
    }
  ]);

  const [puzzles, setPuzzles] = useState<Puzzle[]>([
    {
      id: '1',
      title: 'Database Breach',
      question: 'A hacker has accessed the database. What is the most likely entry point?',
      correctAnswer: 'SQL Injection',
      difficulty: 'medium',
      hint1: 'Think about web application vulnerabilities',
      hint2: 'It involves database queries',
      type: 'detective'
    },
    {
      id: '2',
      title: 'Two Sum Problem',
      question: 'Given an array of integers and a target sum, return indices of two numbers that add up to the target.',
      correctAnswer: 'function twoSum(nums, target) { /* solution */ }',
      difficulty: 'easy',
      type: 'hacker'
    }
  ]);

  // Room Management
  const [newRoom, setNewRoom] = useState({
    name: '',
    maxPlayers: 8,
    gameMode: 'classic' as const,
    difficulty: 'medium' as const
  });

  // Puzzle Management
  const [newPuzzle, setNewPuzzle] = useState({
    title: '',
    question: '',
    correctAnswer: '',
    difficulty: 'medium' as const,
    hint1: '',
    hint2: '',
    type: 'detective' as const
  });

  const handleCreateRoom = () => {
    if (!newRoom.name.trim()) return;
    
    const room: Room = {
      id: Date.now().toString(),
      name: newRoom.name,
      maxPlayers: newRoom.maxPlayers,
      currentPlayers: 0,
      status: 'waiting',
      gameMode: newRoom.gameMode,
      difficulty: newRoom.difficulty,
      createdAt: new Date()
    };
    
    setRooms([...rooms, room]);
    setNewRoom({ name: '', maxPlayers: 8, gameMode: 'classic', difficulty: 'medium' });
  };

  const handleCreatePuzzle = () => {
    if (!newPuzzle.title.trim() || !newPuzzle.question.trim() || !newPuzzle.correctAnswer.trim()) return;
    
    const puzzle: Puzzle = {
      id: Date.now().toString(),
      ...newPuzzle
    };
    
    setPuzzles([...puzzles, puzzle]);
    setNewPuzzle({
      title: '',
      question: '',
      correctAnswer: '',
      difficulty: 'medium',
      hint1: '',
      hint2: '',
      type: 'detective'
    });
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter(room => room.id !== roomId));
  };

  const handleDeletePuzzle = (puzzleId: string) => {
    setPuzzles(puzzles.filter(puzzle => puzzle.id !== puzzleId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-500';
      case 'starting': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-secondary border-b border-primary/20">
        <div className="flex items-center space-x-2">
          <Terminal className="h-8 w-8 text-primary" />
          <span className="text-xl font-heading font-bold text-secondary-foreground">ADMIN PANEL</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="font-paragraph">
            <Settings className="mr-1 h-3 w-3" />
            Administrator
          </Badge>
          <Button asChild variant="outline" size="sm">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rooms" className="font-paragraph">Room Management</TabsTrigger>
            <TabsTrigger value="puzzles" className="font-paragraph">Puzzle Management</TabsTrigger>
            <TabsTrigger value="monitoring" className="font-paragraph">Live Monitoring</TabsTrigger>
            <TabsTrigger value="settings" className="font-paragraph">System Settings</TabsTrigger>
          </TabsList>

          {/* Room Management */}
          <TabsContent value="rooms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Create Room */}
              <Card className="p-6">
                <h3 className="text-xl font-heading font-semibold text-textprimary mb-4">
                  Create New Room
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="room-name" className="font-paragraph">Room Name</Label>
                    <Input
                      id="room-name"
                      placeholder="Enter room name"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                      className="font-paragraph"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="max-players" className="font-paragraph">Max Players</Label>
                    <Select value={newRoom.maxPlayers.toString()} onValueChange={(value) => setNewRoom({ ...newRoom, maxPlayers: parseInt(value) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 Players</SelectItem>
                        <SelectItem value="6">6 Players</SelectItem>
                        <SelectItem value="8">8 Players</SelectItem>
                        <SelectItem value="12">12 Players</SelectItem>
                        <SelectItem value="16">16 Players</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="game-mode" className="font-paragraph">Game Mode</Label>
                    <Select value={newRoom.gameMode} onValueChange={(value: any) => setNewRoom({ ...newRoom, gameMode: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classic">Classic (45min)</SelectItem>
                        <SelectItem value="blitz">Blitz (15min)</SelectItem>
                        <SelectItem value="tournament">Tournament (60min)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="difficulty" className="font-paragraph">Difficulty</Label>
                    <Select value={newRoom.difficulty} onValueChange={(value: any) => setNewRoom({ ...newRoom, difficulty: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={handleCreateRoom} className="w-full font-paragraph">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Room
                  </Button>
                </div>
              </Card>

              {/* Active Rooms */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xl font-heading font-semibold text-textprimary">
                  Active Rooms ({rooms.length})
                </h3>
                
                {rooms.map((room) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-heading font-semibold text-textprimary mb-2">
                            {room.name}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm font-paragraph text-textprimary/70">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{room.currentPlayers}/{room.maxPlayers}</span>
                            </div>
                            <Badge variant="outline" className="font-paragraph text-xs">
                              {room.gameMode.toUpperCase()}
                            </Badge>
                            <span className={`font-semibold ${getDifficultyColor(room.difficulty)}`}>
                              {room.difficulty.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(room.status)}`} />
                          <Badge variant="outline" className="font-paragraph text-xs">
                            {room.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="font-paragraph">
                          <Eye className="mr-1 h-3 w-3" />
                          Monitor
                        </Button>
                        <Button size="sm" variant="outline" className="font-paragraph">
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        {room.status === 'waiting' && (
                          <Button size="sm" variant="outline" className="font-paragraph">
                            <Play className="mr-1 h-3 w-3" />
                            Force Start
                          </Button>
                        )}
                        {room.status === 'active' && (
                          <Button size="sm" variant="outline" className="font-paragraph">
                            <Pause className="mr-1 h-3 w-3" />
                            Pause
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteRoom(room.id)}
                          className="font-paragraph"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Puzzle Management */}
          <TabsContent value="puzzles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Create Puzzle */}
              <Card className="p-6">
                <h3 className="text-xl font-heading font-semibold text-textprimary mb-4">
                  Create New Puzzle
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="puzzle-type" className="font-paragraph">Puzzle Type</Label>
                    <Select value={newPuzzle.type} onValueChange={(value: any) => setNewPuzzle({ ...newPuzzle, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detective">Detective Puzzle</SelectItem>
                        <SelectItem value="hacker">Hacker Task</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="puzzle-title" className="font-paragraph">Title</Label>
                    <Input
                      id="puzzle-title"
                      placeholder="Enter puzzle title"
                      value={newPuzzle.title}
                      onChange={(e) => setNewPuzzle({ ...newPuzzle, title: e.target.value })}
                      className="font-paragraph"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="puzzle-question" className="font-paragraph">Question/Problem</Label>
                    <Textarea
                      id="puzzle-question"
                      placeholder="Enter the puzzle question or problem statement"
                      value={newPuzzle.question}
                      onChange={(e) => setNewPuzzle({ ...newPuzzle, question: e.target.value })}
                      className="font-paragraph min-h-[100px]"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="puzzle-answer" className="font-paragraph">Correct Answer</Label>
                    <Textarea
                      id="puzzle-answer"
                      placeholder="Enter the correct answer or solution"
                      value={newPuzzle.correctAnswer}
                      onChange={(e) => setNewPuzzle({ ...newPuzzle, correctAnswer: e.target.value })}
                      className="font-paragraph"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="puzzle-difficulty" className="font-paragraph">Difficulty</Label>
                    <Select value={newPuzzle.difficulty} onValueChange={(value: any) => setNewPuzzle({ ...newPuzzle, difficulty: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="hint1" className="font-paragraph">Hint 1 (Optional)</Label>
                    <Input
                      id="hint1"
                      placeholder="First hint"
                      value={newPuzzle.hint1}
                      onChange={(e) => setNewPuzzle({ ...newPuzzle, hint1: e.target.value })}
                      className="font-paragraph"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hint2" className="font-paragraph">Hint 2 (Optional)</Label>
                    <Input
                      id="hint2"
                      placeholder="Second hint"
                      value={newPuzzle.hint2}
                      onChange={(e) => setNewPuzzle({ ...newPuzzle, hint2: e.target.value })}
                      className="font-paragraph"
                    />
                  </div>
                  
                  <Button onClick={handleCreatePuzzle} className="w-full font-paragraph">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Puzzle
                  </Button>
                </div>
              </Card>

              {/* Puzzle List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-heading font-semibold text-textprimary">
                    Puzzles & Tasks ({puzzles.length})
                  </h3>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="font-paragraph">
                      <Upload className="mr-2 h-4 w-4" />
                      Import
                    </Button>
                    <Button variant="outline" size="sm" className="font-paragraph">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
                
                {puzzles.map((puzzle) => (
                  <motion.div
                    key={puzzle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-lg font-heading font-semibold text-textprimary">
                              {puzzle.title}
                            </h4>
                            <Badge variant="outline" className="font-paragraph text-xs">
                              {puzzle.type === 'detective' ? (
                                <><Shield className="mr-1 h-3 w-3" /> DETECTIVE</>
                              ) : (
                                <><Code className="mr-1 h-3 w-3" /> HACKER</>
                              )}
                            </Badge>
                            <span className={`font-paragraph text-sm font-semibold ${getDifficultyColor(puzzle.difficulty)}`}>
                              {puzzle.difficulty.toUpperCase()}
                            </span>
                          </div>
                          <p className="font-paragraph text-sm text-textprimary/70 mb-2 line-clamp-2">
                            {puzzle.question}
                          </p>
                          {(puzzle.hint1 || puzzle.hint2) && (
                            <div className="text-xs font-paragraph text-textprimary/50">
                              Hints available: {[puzzle.hint1, puzzle.hint2].filter(Boolean).length}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="font-paragraph">
                          <Eye className="mr-1 h-3 w-3" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" className="font-paragraph">
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeletePuzzle(puzzle.id)}
                          className="font-paragraph"
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Live Monitoring */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-heading font-semibold text-textprimary mb-4">
                  System Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-paragraph text-textprimary/70">Server Status</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="font-paragraph text-sm text-textprimary">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-paragraph text-textprimary/70">Active Rooms</span>
                    <span className="font-paragraph text-sm text-textprimary">{rooms.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-paragraph text-textprimary/70">Total Players</span>
                    <span className="font-paragraph text-sm text-textprimary">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-paragraph text-textprimary/70">Judge0 API</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="font-paragraph text-sm text-textprimary">Connected</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-heading font-semibold text-textprimary mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3 text-sm font-paragraph">
                  <div className="flex items-center justify-between">
                    <span className="text-textprimary/70">Room "Cyber Heist" started</span>
                    <span className="text-textprimary/50">2m ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-textprimary/70">Player "CyberNinja" joined</span>
                    <span className="text-textprimary/50">5m ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-textprimary/70">New puzzle created</span>
                    <span className="text-textprimary/50">10m ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-textprimary/70">Anti-cheat alert resolved</span>
                    <span className="text-textprimary/50">15m ago</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-heading font-semibold text-textprimary mb-4">
                System Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="judge0-url" className="font-paragraph">Judge0 API URL</Label>
                    <Input
                      id="judge0-url"
                      placeholder="https://api.judge0.com"
                      className="font-paragraph"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-rooms" className="font-paragraph">Max Concurrent Rooms</Label>
                    <Input
                      id="max-rooms"
                      type="number"
                      placeholder="50"
                      className="font-paragraph"
                    />
                  </div>
                  <div>
                    <Label htmlFor="session-timeout" className="font-paragraph">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      placeholder="30"
                      className="font-paragraph"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="anti-cheat" className="font-paragraph">Anti-cheat Sensitivity</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="backup-interval" className="font-paragraph">Backup Interval (hours)</Label>
                    <Input
                      id="backup-interval"
                      type="number"
                      placeholder="6"
                      className="font-paragraph"
                    />
                  </div>
                  <div>
                    <Label htmlFor="log-level" className="font-paragraph">Log Level</Label>
                    <Select defaultValue="info">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex space-x-4">
                <Button className="font-paragraph">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
                <Button variant="outline" className="font-paragraph">
                  Reset to Defaults
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}