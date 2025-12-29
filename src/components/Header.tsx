"use client";

import React, { useState } from "react";
import { Shield, Cpu, Code, Activity, BarChart3, Trash2, MoreVertical, Target, X } from "lucide-react";

interface HeaderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    points: number;
    level: number;
    onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, points, level, onReset }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);

    const tabs = [
        { id: "tasks", label: "COMMAND CENTER", icon: Shield },
        { id: "life", label: "LIFE PROTOCOLS", icon: Target },
        { id: "leetcode", label: "LEETCODE LAB", icon: Code },
        { id: "activity", label: "ACTIVITY LOG", icon: Activity },
        { id: "analytics", label: "ANALYTICS", icon: BarChart3 },
    ];

    const nextLevelPoints = level * 1000;
    const progress = Math.min((points / nextLevelPoints) * 100, 100);

    return (
        <>
            <header className="w-full border-b border-green-500/30 bg-black/80 backdrop-blur-md sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,255,65,0.1)]">
                <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3 group cursor-default">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500 blur-md opacity-50 rounded-full animate-pulse group-hover:opacity-80 transition-opacity duration-500"></div>
                            <Cpu className="w-10 h-10 text-cyan-400 relative z-10 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-white tracking-wider text-glow group-hover:text-cyan-300 transition-colors">
                                JARVIS <span className="text-green-500 group-hover:text-green-400">OS</span>
                            </h1>
                            <p className="text-xs text-green-400/70 font-mono tracking-[0.2em] group-hover:text-green-400 transition-colors">SYSTEM ONLINE</p>
                        </div>
                    </div>

                    <nav className="flex items-center gap-2 bg-green-900/10 p-1.5 rounded-lg border border-green-500/20 backdrop-blur-sm">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 font-display text-sm tracking-wide relative overflow-hidden group ${activeTab === tab.id
                                    ? "bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_15px_rgba(0,255,65,0.2)]"
                                    : "text-gray-400 hover:text-green-300 hover:bg-green-500/5"
                                    }`}
                            >
                                <div className={`absolute inset-0 bg-green-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${activeTab === tab.id ? 'hidden' : ''}`}></div>
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                                <span className="hidden sm:inline relative z-10">{tab.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <div
                            onClick={() => setIsRoadmapOpen(true)}
                            className="flex items-center gap-6 bg-black/40 px-6 py-2 rounded-lg border border-green-500/10 cursor-pointer hover:border-green-500/30 hover:bg-green-500/5 transition-all group"
                        >
                            <div className="text-right">
                                <p className="text-[10px] text-gray-500 font-mono tracking-widest group-hover:text-cyan-400 transition-colors">LEVEL</p>
                                <p className="text-xl font-display font-bold text-cyan-400 text-glow">{level}</p>
                            </div>
                            <div className="h-8 w-px bg-gradient-to-b from-transparent via-green-500/30 to-transparent group-hover:via-green-500/60 transition-all"></div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-500 font-mono tracking-widest group-hover:text-green-400 transition-colors">POINTS</p>
                                <p className="text-xl font-display font-bold text-green-400 text-glow-green">{points}</p>
                            </div>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-green-500/70 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all border border-transparent hover:border-green-500/30"
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 border border-green-500/30 rounded-lg shadow-[0_0_20px_rgba(0,255,65,0.2)] backdrop-blur-md overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                    <button
                                        onClick={() => {
                                            if (confirm("WARNING: SYSTEM PURGE INITIATED. ALL DATA WILL BE LOST. CONFIRM?")) {
                                                onReset();
                                            }
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-mono text-xs tracking-wider"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        RESET SYSTEM
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Decorative bottom border gradient */}
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-green-500/50 to-transparent shadow-[0_0_10px_rgba(0,255,65,0.5)]"></div>
            </header>

            {/* Roadmap Modal */}
            {isRoadmapOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={() => setIsRoadmapOpen(false)}>
                    <div className="bg-black border border-green-500/30 rounded-xl p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(0,255,65,0.15)]" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setIsRoadmapOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 mb-4 shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                                <Target className="w-8 h-8 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-white tracking-wider">PROGRESS ROADMAP</h2>
                            <p className="text-green-500/70 font-mono text-xs mt-2">LEVEL {level} OPERATIVE</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-mono text-gray-400 mb-2">
                                    <span>CURRENT PROGRESS</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                    <div
                                        className="h-full bg-green-500 shadow-[0_0_10px_rgba(0,255,65,0.5)] transition-all duration-1000 ease-out"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs font-mono mt-2">
                                    <span className="text-cyan-400">{points} PTS</span>
                                    <span className="text-gray-500">TARGET: {nextLevelPoints} PTS</span>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-800">
                                <h3 className="text-xs font-mono text-gray-500 mb-4">UPCOMING MILESTONES</h3>
                                {[1, 2, 3].map((offset) => (
                                    <div key={offset} className="flex items-center gap-4 opacity-50">
                                        <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 font-display">
                                            {level + offset}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-400 text-xs font-mono">LEVEL {level + offset}</p>
                                            <p className="text-gray-600 text-[10px] font-mono">{(level + offset) * 1000} POINTS REQUIRED</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-xs text-green-500/50 font-mono animate-pulse">
                                {nextLevelPoints - points} POINTS REMAINING FOR NEXT LEVEL
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
