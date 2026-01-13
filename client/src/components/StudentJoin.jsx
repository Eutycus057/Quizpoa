import React, { useState } from 'react';
import useGameStore from '../store/useGameStore';
import { UserCircle, GraduationCap, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentJoin = () => {
    const [pin, setPin] = useState('');
    const [name, setName] = useState('');
    const { joinRoom, error } = useGameStore();

    const handleJoin = (e) => {
        e.preventDefault();
        if (!pin || !name) return;
        joinRoom(pin, name);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#F8FAFC] text-[#1E293B]">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100"
            >
                <div className="absolute top-8 left-8 flex items-center gap-2 font-black text-sm tracking-tight">
                    <img src="/logo.png" alt="Eutycreatives" className="w-8 h-8 object-contain" />
                    <span>
                        <span className="text-blue-600">Euty</span>
                        <span className="text-orange-500">creatives</span>
                    </span>
                </div>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <UserCircle className="text-[#6366F1]" size={40} />
                    </div>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">Join Quiz</h1>
                    <p className="text-slate-500 font-medium">Ready to show your skills?</p>
                </div>

                <form onSubmit={handleJoin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Game Pin</label>
                        <input
                            type="text"
                            maxLength={6}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-[#1E293B] placeholder-slate-300 focus:border-[#6366F1] focus:bg-white focus:outline-none text-center text-4xl font-black tracking-[0.3em] transition-all"
                            placeholder="000000"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Your Name</label>
                        <input
                            type="text"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-[#1E293B] placeholder-slate-300 focus:border-[#6366F1] focus:bg-white focus:outline-none text-xl font-bold transition-all"
                            placeholder="e.g. Einstein"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-xl"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white font-black py-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
                    >
                        Enter Arena <ChevronRight size={24} />
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default StudentJoin;
