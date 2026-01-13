/**
 * Manages game rooms, players, and state.
 */
class RoomManager {
    constructor() {
        this.rooms = new Map();
    }

    /**
     * Generates a 6-digit game pin.
     */
    generatePin() {
        let pin;
        do {
            pin = Math.floor(100000 + Math.random() * 900000).toString();
        } while (this.rooms.has(pin));
        return pin;
    }

    createRoom(hostId, questions) {
        const pin = this.generatePin();
        const room = {
            pin,
            hostId,
            questions,
            players: [],
            status: 'Lobby', // Lobby, Question, Leaderboard, Results
            currentQuestionIndex: -1,
            timer: 20,
            scores: {}, // { socketId: score }
            playerData: {}, // { socketId: { name, score } }
        };
        this.rooms.set(pin, room);
        return room;
    }

    getRoom(pin) {
        return this.rooms.get(pin);
    }

    joinRoom(pin, socketId, playerName) {
        const room = this.rooms.get(pin);
        if (!room) return null;

        if (room.status !== 'Lobby') {
            throw new Error("Game already in progress");
        }

        room.players.push(socketId);
        room.playerData[socketId] = { name: playerName, score: 0 };
        return room;
    }

    leaveRoom(socketId) {
        for (const [pin, room] of this.rooms.entries()) {
            if (room.players.includes(socketId)) {
                room.players = room.players.filter(id => id !== socketId);
                delete room.playerData[socketId];
                if (room.players.length === 0 && room.hostId !== socketId) {
                    // Keep room if host is still there or if there are players
                }
                return pin;
            }
        }
        return null;
    }

    updateScore(pin, socketId, points) {
        const room = this.rooms.get(pin);
        if (room && room.playerData[socketId]) {
            room.playerData[socketId].score += points;
        }
    }

    deleteRoom(pin) {
        this.rooms.delete(pin);
    }
}

module.exports = new RoomManager();
