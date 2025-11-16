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
                      <Label>Test Cases (JSON format)</Label>
                      <Textarea
                        value={newTask.testCasesJson}
                        onChange={(e) => setNewTask({...newTask, testCasesJson: e.target.value})}
                        className="bg-dark-bg border-neon-blue/50 text-neon-green"
                        rows={4}
                        placeholder='[{"input": "nums = [2,7,11,15], target = 9", "expectedOutput": "[0,1]"}]'
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Enter test cases as JSON array. Each test case can be a string or object with input/expectedOutput properties.
                      </p>
                    </div>
                    <div>
                      <Label>Boilerplate Code</Label>
                      <Textarea
                        value={newTask.boilerplateCode}
                        onChange={(e) => setNewTask({...newTask, boilerplateCode: e.target.value})}
                        className="bg-dark-bg border-neon-blue/50 text-neon-green"
                        rows={3}
                        placeholder="function solution() {\n  // Your code here\n}"
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
                        <div className="flex gap-2 mb-2">
                          <span className="text-sm text-neon-purple">Difficulty: {task.difficultyLevel}/5</span>
                          <span className="text-sm text-neon-green">Languages: {task.allowedLanguages}</span>
                        </div>
                        {task.testCasesJson && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">Test Cases: </span>
                            <span className="text-xs text-neon-blue">
                              {(() => {
                                try {
                                  const parsed = JSON.parse(task.testCasesJson);
                                  return Array.isArray(parsed) ? `${parsed.length} test case(s)` : 'Invalid format';
                                } catch {
                                  return 'Invalid JSON';
                                }
                              })()}
                            </span>
                          </div>
                        )}
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

