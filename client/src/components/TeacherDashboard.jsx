import React, { useState } from 'react';
import useGameStore from '../store/useGameStore';
import {
    LayoutDashboard,
    BarChart3,
    Users,
    Settings,
    Plus,
    Sparkles,
    Play,
    LogOut,
    ChevronRight,
    BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TeacherDashboard = () => {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const { createRoom, roomPin, players, startGame } = useGameStore();

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            console.log(`Sending request to: ${API_URL}/api/generate-quiz`);

            const response = await fetch(`${API_URL}/api/generate-quiz`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server responded with ${response.status}`);
            }

            const data = await response.json();
            if (data.questions) {
                createRoom(data.questions);
            } else {
                throw new Error("No questions returned from server");
            }
        } catch (err) {
            console.error('Generation Error:', err);
            alert(`Failed to generate quiz: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const Sidebar = () => (
        <div className="w-64 bg-[#1E293B] min-h-screen p-6 flex flex-col hidden lg:flex">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center p-1.5 overflow-hidden">
                    <img src="/logo.png" alt="Eutycreatives" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-black leading-tight tracking-tight">
                        <span className="text-blue-400">Euty</span>
                        <span className="text-orange-400">creatives</span>
                    </span>
                    <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">Quizpoa</span>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                <div className="sidebar-item-active"><LayoutDashboard size={20} /> Dashboard</div>
                <div className="sidebar-item"><Plus size={20} /> My Quizzes</div>
                <div className="sidebar-item"><BarChart3 size={20} /> Analytics</div>
                <div className="sidebar-item"><Users size={20} /> Classes</div>
            </nav>

            <div className="pt-6 border-t border-slate-700">
                <div className="sidebar-item"><Settings size={20} /> Settings</div>
                <div className="sidebar-item text-red-400 hover:text-red-300"><LogOut size={20} /> Log Out</div>
            </div>
        </div>
    );

    if (roomPin) {
        return (
            <div className="flex min-h-screen bg-[#F8FAFC]">
                <Sidebar />
                <main className="flex-1 p-8 lg:p-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-3xl font-extrabold text-[#1E293B] mb-2">Game Lobby</h1>
                                <p className="text-slate-500">Wait for students to join using the pin below</p>
                            </div>
                            <div className="bg-white px-8 py-4 rounded-2xl shadow-sm border border-slate-200">
                                <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest block mb-1">Game Pin</span>
                                <span className="text-4xl font-black text-[#6366F1] tracking-[0.2em]">{roomPin}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[400px]">
                                    <h3 className="text-lg font-bold text-[#1E293B] mb-6 flex items-center gap-2">
                                        Joined Players <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-sm">{players.length}</span>
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <AnimatePresence>
                                            {players.map((p, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                        {p.name.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-slate-700 truncate">{p.name}</span>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                    {players.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                            <Users size={48} className="mb-4 opacity-20" />
                                            <p>Waiting for students to join...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="bg-[#1E293B] text-white rounded-2xl p-6 shadow-xl sticky top-8">
                                    <h3 className="text-lg font-bold mb-4">Command Center</h3>
                                    <p className="text-slate-400 text-sm mb-6">Start the quiz once all students are in the room.</p>
                                    <button
                                        onClick={startGame}
                                        disabled={players.length === 0}
                                        className="w-full bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-slate-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                                    >
                                        <Play size={20} fill="currentColor" />
                                        Start Match
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />
            <main className="flex-1 p-8 lg:p-12">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#1E293B]">Dashboard</h1>
                        <p className="text-slate-500 mt-1">Welcome back, Professor!</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 pr-4">
                            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <LayoutDashboard size={20} />
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-[#1E293B]">Primary Class</p>
                                <p className="text-slate-500 text-xs">Section A-1</p>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="max-w-4xl">
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
                        <div className="p-8 md:p-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                                <Sparkles size={14} /> AI Creation Zone
                            </div>
                            <h2 className="text-3xl font-bold text-[#1E293B] mb-8">What are we learning today?</h2>

                            <div className="relative mb-8 text-slate-400 focus-within:text-indigo-500 group">
                                <textarea
                                    className="w-full h-48 bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl p-6 text-slate-900 placeholder-slate-400 focus:outline-none transition-all resize-none shadow-inner"
                                    placeholder="Paste an article, a chapter summary, or just a topic name like 'Cell Biology'..."
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading || !topic.trim()}
                                    className="relative group bg-[#6366F1] hover:bg-[#4F46E5] disabled:bg-slate-200 text-white font-bold py-5 px-10 rounded-2xl flex items-center gap-3 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 disabled:shadow-none"
                                >
                                    <motion.div
                                        animate={loading ? { rotate: 360 } : {}}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    >
                                        <Sparkles size={20} />
                                    </motion.div>
                                    {loading ? 'Magic in progress...' : 'Magic Generate'}
                                    {!loading && topic.trim() && (
                                        <motion.div
                                            className="absolute inset-x-0 inset-y-0 rounded-2xl bg-indigo-400/20 blur-xl -z-10 group-hover:block hidden"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-6 flex items-center gap-8 border-t border-slate-100">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-${i + 2}00`} />)}
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Over <span className="text-indigo-600 font-bold">2,400 teachers</span> generated quizzes this week.</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default TeacherDashboard;
