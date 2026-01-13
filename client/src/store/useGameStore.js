import { create } from 'zustand';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const useGameStore = create((set, get) => ({
    socket,
    role: null, // 'teacher' | 'student'
    roomPin: null,
    playerName: '',
    gameState: 'Lobby', // Lobby, Question, Leaderboard, Results
    timer: 20,
    players: [],
    currentQuestion: null,
    totalQuestions: 0,
    currentQuestionIndex: 0,
    score: 0,
    leaderboard: [],
    error: null,

    setRole: (role) => set({ role }),
    setPlayerName: (name) => set({ playerName: name }),
    setError: (error) => set({ error }),

    createRoom: (questions) => {
        socket.emit('createRoom', { questions });
    },

    joinRoom: (pin, name) => {
        socket.emit('joinRoom', { pin, playerName: name });
    },

    startGame: () => {
        const { roomPin } = get();
        socket.emit('startGame', { pin: roomPin });
    },

    submitAnswer: (answerIndex) => {
        const { roomPin } = get();
        socket.emit('submitAnswer', { pin: roomPin, answerIndex });
    },

    nextQuestion: () => {
        const { roomPin } = get();
        socket.emit('nextQuestion', { pin: roomPin });
    }
}));

// Socket listeners
socket.on('roomCreated', (room) => {
    useGameStore.setState({ roomPin: room.pin, role: 'teacher', gameState: 'Lobby' });
});

socket.on('joinSuccess', (room) => {
    useGameStore.setState({ roomPin: room.pin, role: 'student', gameState: 'Lobby', players: Object.values(room.playerData) });
});

socket.on('playerJoined', ({ players }) => {
    useGameStore.setState({ players });
});

socket.on('questionStarted', ({ question, currentQuestionIndex, totalQuestions, timer }) => {
    useGameStore.setState({
        gameState: 'Question',
        currentQuestion: question,
        currentQuestionIndex,
        totalQuestions,
        timer
    });
});

socket.on('timerUpdate', (timer) => {
    useGameStore.setState({ timer });
});

socket.on('showLeaderboard', ({ players, correctAnswer, explanation }) => {
    useGameStore.setState({
        gameState: 'Leaderboard',
        leaderboard: players,
        currentQuestion: { ...useGameStore.getState().currentQuestion, correctAnswer, explanation }
    });
});

socket.on('gameEnded', ({ players }) => {
    useGameStore.setState({ gameState: 'Results', leaderboard: players });
});

socket.on('error', (err) => {
    useGameStore.setState({ error: err });
});

export default useGameStore;
