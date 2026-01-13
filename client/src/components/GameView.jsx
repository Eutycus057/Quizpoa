import React, { useState, useEffect } from 'react';
import useGameStore from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    Trophy,
    ChevronRight,
    CheckCircle2,
    Circle,
    Triangle,
    Square,
    Diamond
} from 'lucide-react';

const GameView = () => {
    const {
        gameState,
        currentQuestion,
        timer,
        submitAnswer,
        leaderboard,
        nextQuestion,
        role,
        currentQuestionIndex,
        totalQuestions,
        roomPin
    } = useGameStore();

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [hasAnswered, setHasAnswered] = useState(false);

    useEffect(() => {
        if (gameState === 'Question') {
            setSelectedAnswer(null);
            setHasAnswered(false);
        }
    }, [gameState, currentQuestionIndex]);

    const handleAnswer = (index) => {
        if (hasAnswered || role === 'teacher') return;
        setSelectedAnswer(index);
        setHasAnswered(true);
        submitAnswer(index);
    };

    const answerUI = [
        { color: 'bg-[#EF4444]', icon: Circle, label: 'A' },
        { color: 'bg-[#3B82F6]', icon: Triangle, label: 'B' },
        { color: 'bg-[#F59E0B]', icon: Square, label: 'C' },
        { color: 'bg-[#10B981]', icon: Diamond, label: 'D' }
    ];

    if (gameState === 'Lobby') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
                <div className="absolute top-8 left-8 flex items-center gap-2 font-black text-sm tracking-tight">
                    <div className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center p-1 overflow-hidden">
                        <img src="/logo.png" alt="Eutycreatives" className="w-full h-full object-contain" />
                    </div>
                    <span>
                        <span className="text-blue-600">Euty</span>
                        <span className="text-orange-500">creatives</span>
                    </span>
                </div>
                <div className="w-24 h-24 bg-indigo-50 flex items-center justify-center rounded-full mb-8 relative">
                    <Clock size={40} className="text-[#6366F1] animate-pulse" />
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin" />
                </div>
                <h1 className="text-4xl font-black text-[#1E293B] mb-4 tracking-tight">Hang Tight!</h1>
                <p className="text-slate-500 text-lg mb-10 max-w-xs mx-auto">
                    You're in room <span className="text-[#6366F1] font-bold">#{roomPin}</span>.
                    The teacher is preparing the quiz.
                </p>
                <div className="flex gap-2 justify-center">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                            className="w-3 h-3 bg-indigo-500 rounded-full"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (gameState === 'Question') {
        return (
            <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
                {/* Visual Timer Bar */}
                <div className="w-full h-2 bg-slate-100 sticky top-0 z-50">
                    <motion.div
                        className={`h-full ${timer <= 5 ? 'bg-red-500' : 'bg-[#6366F1]'}`}
                        initial={{ width: '100%' }}
                        animate={{ width: `${(timer / 20) * 100}%` }}
                        transition={{ duration: 1, ease: "linear" }}
                    />
                </div>

                <div className="flex-1 p-6 flex flex-col max-w-2xl mx-auto w-full">
                    <header className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-2 font-black text-xs tracking-tight hidden sm:flex">
                            <div className="w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center p-1 overflow-hidden">
                                <img src="/logo.png" alt="Eutycreatives" className="w-full h-full object-contain" />
                            </div>
                            <span>
                                <span className="text-blue-600">Euty</span>
                                <span className="text-orange-500">creatives</span>
                            </span>
                        </div>
                        <span className="text-sm font-bold text-slate-400 tracking-widest uppercase">
                            Q {currentQuestionIndex + 1} / {totalQuestions}
                        </span>
                        <div className={`flex items-center gap-2 px-4 py-1 rounded-full font-bold ${timer <= 5 ? 'text-red-500 bg-red-50' : 'text-[#6366F1] bg-indigo-50'}`}>
                            <Clock size={16} /> <span>{timer}s</span>
                        </div>
                    </header>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E293B] leading-tight text-center">
                            {currentQuestion?.question}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-4 flex-1 pb-10">
                        {currentQuestion?.options.map((option, i) => {
                            const UI = answerUI[i];
                            return (
                                <button
                                    key={i}
                                    disabled={hasAnswered || role === 'teacher'}
                                    onClick={() => handleAnswer(i)}
                                    className={`
                                      relative group overflow-hidden
                                      bg-white border-2 p-6 rounded-[20px] shadow-sm 
                                      flex items-center gap-6 transition-all active:scale-[0.97] text-left
                                      ${selectedAnswer === i
                                            ? 'border-[#6366F1] bg-indigo-50 ring-4 ring-indigo-500/10'
                                            : 'border-slate-100 hover:border-slate-200'}
                                      ${hasAnswered && selectedAnswer !== i ? 'opacity-50' : ''}
                                    `}
                                >
                                    <div className={`${UI.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                                        <UI.icon size={32} strokeWidth={3} />
                                    </div>
                                    <span className="text-xl font-bold text-[#1E293B] flex-1">
                                        {option}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {role === 'teacher' && (
                        <div className="bg-[#1E293B] text-white/50 p-4 rounded-2xl text-center text-sm font-medium">
                            <span className="text-[#6366F1]">Host Mode:</span> Students are answering now...
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (gameState === 'Leaderboard') {
        return (
            <div className="min-h-screen bg-slate-900 text-white p-6 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[100px]" />
                </div>

                <div className="absolute top-8 left-8 flex items-center gap-2 z-20 font-black text-sm tracking-tight">
                    <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center p-1 overflow-hidden">
                        <img src="/logo.png" alt="Eutycreatives" className="w-full h-full object-contain" />
                    </div>
                    <span>
                        <span className="text-blue-400">Euty</span>
                        <span className="text-orange-400">creatives</span>
                    </span>
                </div>

                <div className="relative z-10 max-w-2xl mx-auto py-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-indigo-300 mb-4">
                            <Trophy size={14} /> Round Results
                        </div>
                        <h2 className="text-4xl font-black mb-2 tracking-tight">The Board</h2>
                    </div>

                    {/* Correct Answer Box (Glassmorphic) */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl mb-8">
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Correct Answer</p>
                        <div className="flex items-center gap-4 text-emerald-400 mb-3 text-xl font-bold">
                            <CheckCircle2 size={28} /> {currentQuestion?.options[currentQuestion?.correctAnswerIndex]}
                        </div>
                        <p className="text-white/60 italic text-sm">"{currentQuestion?.explanation}"</p>
                    </div>

                    {/* Leaderboard List */}
                    <div className="space-y-3 mb-12">
                        {leaderboard.slice(0, 5).map((player, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`
                                flex justify-between items-center p-5 rounded-2xl 
                                ${i === 0 ? 'bg-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-white/5'}
                              `}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${i === 0 ? 'bg-white text-indigo-500' : 'bg-white/10 text-white/40'}`}>
                                        {i + 1}
                                    </span>
                                    <span className="font-bold text-lg">{player.name}</span>
                                </div>
                                <span className="font-mono font-bold text-2xl">{player.score}</span>
                            </motion.div>
                        ))}
                    </div>

                    {role === 'teacher' && (
                        <button
                            onClick={nextQuestion}
                            className="w-full bg-white text-slate-900 font-black py-5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
                        >
                            Next Question <ChevronRight size={24} />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (gameState === 'Results') {
        const sorted = [...leaderboard].sort((a, b) => b.score - a.score);
        return (
            <div className="min-h-screen bg-[#1E293B] text-white p-6 flex flex-col items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="text-center mb-12 relative">
                        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-90 font-black text-sm tracking-tight">
                            <div className="w-8 h-8 bg-white rounded-full shadow-xl flex items-center justify-center p-1 overflow-hidden">
                                <img src="/logo.png" alt="Eutycreatives" className="w-full h-full object-contain" />
                            </div>
                            <span>
                                <span className="text-blue-400">Euty</span>
                                <span className="text-orange-400">creatives</span>
                            </span>
                        </div>
                        <Trophy size={100} className="text-yellow-400 mx-auto mb-6 drop-shadow-2xl" />
                        <h1 className="text-5xl font-black mb-2">Victory!</h1>
                        <p className="text-slate-400">Here's how you performed</p>
                    </div>

                    {/* Podium / Final Standings */}
                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 mb-10">
                        <div className="space-y-4">
                            {sorted.slice(0, 3).map((player, i) => (
                                <div key={i} className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/5">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl 
                                          ${i === 0 ? 'bg-yellow-400 text-slate-900' :
                                                i === 1 ? 'bg-slate-300 text-slate-900' :
                                                    'bg-orange-400 text-slate-900'}`}>
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-black text-xl">{player.name}</p>
                                            <p className="text-slate-400 text-sm">Finalist</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-3xl text-indigo-400">{player.score}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-black py-6 rounded-[2rem] transition-all active:scale-95 shadow-2xl shadow-indigo-500/30"
                    >
                        New Game
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );
};

export default GameView;
