import React, { useState } from 'react';
import useGameStore from './store/useGameStore';
import TeacherDashboard from './components/TeacherDashboard';
import StudentJoin from './components/StudentJoin';
import GameView from './components/GameView';
import { UserCircle, GraduationCap, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const { role, setRole, gameState, roomPin } = useGameStore();

  if (!role && !roomPin) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Logo at Top Left */}
        <div className="absolute top-8 left-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center p-1.5 overflow-hidden">
            <img src="/logo.png" alt="Eutycreatives Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-xl tracking-tight hidden sm:block">
            <span className="text-blue-600">Euty</span>
            <span className="text-orange-500">creatives</span>
          </span>
        </div>

        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

        <div className="text-center mb-16 max-w-2xl">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 text-slate-600 text-sm mb-8"
          >
            <Sparkles size={16} className="text-indigo-500" />
            <span>Powering the future of learning</span>
          </motion.div>

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-7xl font-black text-[#1E293B] tracking-tight mb-6"
          >
            Quizpoa<span className="text-[#6366F1]">.</span>
          </motion.h1>

          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 font-medium leading-relaxed"
          >
            An AI-powered interface for teachers to build, manage, and host engaging real-time quizzes in seconds.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <motion.button
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => setRole('teacher')}
            className="group relative flex flex-col items-start p-10 bg-white rounded-[2.5rem] border border-slate-200 hover:border-[#6366F1] transition-all shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 text-left"
          >
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#6366F1] group-hover:text-white transition-colors">
              <GraduationCap size={32} />
            </div>
            <h2 className="text-3xl font-black text-[#1E293B] mb-3 group-hover:text-[#6366F1] transition-colors">Educator</h2>
            <p className="text-slate-500 font-medium mb-8">Generate quizzes from your content and lead your class through competition.</p>
            <div className="flex items-center gap-2 text-indigo-500 font-bold group-hover:gap-4 transition-all">
              Host a Room <ChevronRight size={20} />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => setRole('student')}
            className="group relative flex flex-col items-start p-10 bg-white rounded-[2.5rem] border border-slate-200 hover:border-emerald-500 transition-all shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 text-left"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <UserCircle size={32} />
            </div>
            <h2 className="text-3xl font-black text-[#1E293B] mb-3 group-hover:text-emerald-500 transition-colors">Student</h2>
            <p className="text-slate-500 font-medium mb-8">Join your class’s room and show what you’ve learned in a real-time battle.</p>
            <div className="flex items-center gap-2 text-emerald-500 font-bold group-hover:gap-4 transition-all">
              Join a Room <ChevronRight size={20} />
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  if (role === 'teacher' && gameState === 'Lobby') {
    return <TeacherDashboard />;
  }

  if (role === 'student' && !roomPin) {
    return <StudentJoin />;
  }

  return <GameView />;
}

export default App;
