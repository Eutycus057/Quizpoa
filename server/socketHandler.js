const roomManager = require('./roomManager');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('createRoom', ({ questions }) => {
            const room = roomManager.createRoom(socket.id, questions);
            socket.join(room.pin);
            socket.emit('roomCreated', room);
            console.log(`Room created: ${room.pin}`);
        });

        socket.on('joinRoom', ({ pin, playerName }) => {
            try {
                const room = roomManager.joinRoom(pin, socket.id, playerName);
                if (room) {
                    socket.join(pin);
                    io.to(pin).emit('playerJoined', {
                        players: Object.values(room.playerData),
                        pin: room.pin
                    });
                    socket.emit('joinSuccess', room);
                } else {
                    socket.emit('error', 'Room not found');
                }
            } catch (err) {
                socket.emit('error', err.message);
            }
        });

        socket.on('startGame', ({ pin }) => {
            const room = roomManager.getRoom(pin);
            if (room && room.hostId === socket.id) {
                room.status = 'Question';
                room.currentQuestionIndex = 0;
                startTimer(io, pin);
            }
        });

        socket.on('submitAnswer', ({ pin, answerIndex }) => {
            const room = roomManager.getRoom(pin);
            if (room && room.status === 'Question') {
                const question = room.questions[room.currentQuestionIndex];
                if (answerIndex === question.correctAnswerIndex) {
                    // Simple scoring: 100 points for correct answer
                    roomManager.updateScore(pin, socket.id, 100);
                }
                // Notify others that this player answered (optional for UI buzzer effect)
            }
        });

        socket.on('nextQuestion', ({ pin }) => {
            const room = roomManager.getRoom(pin);
            if (room && room.hostId === socket.id) {
                if (room.currentQuestionIndex < room.questions.length - 1) {
                    room.status = 'Question';
                    room.currentQuestionIndex++;
                    startTimer(io, pin);
                } else {
                    room.status = 'Results';
                    io.to(pin).emit('gameEnded', {
                        players: Object.values(room.playerData).sort((a, b) => b.score - a.score)
                    });
                }
            }
        });

        socket.on('disconnect', () => {
            const pin = roomManager.leaveRoom(socket.id);
            if (pin) {
                const room = roomManager.getRoom(pin);
                if (room) {
                    io.to(pin).emit('playerLeft', {
                        players: Object.values(room.playerData)
                    });
                }
            }
            console.log('User disconnected:', socket.id);
        });
    });
};

function startTimer(io, pin) {
    const room = roomManager.getRoom(pin);
    if (!room) return;

    room.timer = 20;
    io.to(pin).emit('questionStarted', {
        question: room.questions[room.currentQuestionIndex],
        currentQuestionIndex: room.currentQuestionIndex,
        totalQuestions: room.questions.length,
        timer: room.timer
    });

    const interval = setInterval(() => {
        const r = roomManager.getRoom(pin);
        if (!r || r.status !== 'Question') {
            clearInterval(interval);
            return;
        }

        r.timer--;
        io.to(pin).emit('timerUpdate', r.timer);

        if (r.timer <= 0) {
            clearInterval(interval);
            r.status = 'Leaderboard';
            io.to(pin).emit('showLeaderboard', {
                players: Object.values(r.playerData).sort((a, b) => b.score - a.score),
                correctAnswer: r.questions[r.currentQuestionIndex].correctAnswerIndex,
                explanation: r.questions[r.currentQuestionIndex].explanation
            });
        }
    }, 1000);
}
