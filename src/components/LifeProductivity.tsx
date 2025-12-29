"use client";

import React, { useState, useMemo } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart
} from "recharts";
import { Plus, Check, Calendar, Activity as ActivityIcon } from "lucide-react";
import { LifeProtocol } from "../types";

interface LifeProductivityProps {
    protocols: LifeProtocol[];
    addProtocol: (text: string) => void;
    toggleProtocol: (id: string, date: string) => void;
}

const LifeProductivity: React.FC<LifeProductivityProps> = ({ protocols, addProtocol, toggleProtocol }) => {
    const [newProtocol, setNewProtocol] = useState("");

    // Get today's date in YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProtocol.trim()) {
            addProtocol(newProtocol);
            setNewProtocol("");
        }
    };

    // Calculate chart data for the last 7 days including today
    const chartData = useMemo(() => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const displayDate = d.toLocaleDateString('en-US', { weekday: 'short' });

            // Calculate total protocols available on that date (created before or on that date)
            // Ideally creation date should be tracked, for simplicity using current total valid ones
            // A more precise way requires filtering by createdAt, assuming we want to track against *active* protocols at that time

            // Simplified productivity: Completed / Total Active
            const activeProtocols = protocols.filter(p => p.createdAt <= d.getTime());

            if (activeProtocols.length === 0) {
                data.push({ name: displayDate, score: 0 });
                continue;
            }

            const completedCount = activeProtocols.filter(p =>
                p.completedDates.includes(dateStr)
            ).length;

            const score = Math.round((completedCount / activeProtocols.length) * 100);
            data.push({ name: displayDate, score });
        }
        return data;
    }, [protocols, today]);

    // Current efficiency
    const currentEfficiency = useMemo(() => {
        if (protocols.length === 0) return 0;
        const completedCount = protocols.filter(p => p.completedDates.includes(today)).length;
        return Math.round((completedCount / protocols.length) * 100);
    }, [protocols, today]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Left: Input and List */}
            <div className="space-y-6 flex flex-col h-full">
                <div className="glass-panel p-6 rounded-xl border border-green-500/30 shadow-[0_0_20px_rgba(0,255,65,0.1)]">
                    <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                        <ActivityIcon className="w-5 h-5 text-green-400" />
                        LIFE PROTOCOLS
                    </h2>

                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={newProtocol}
                            onChange={(e) => setNewProtocol(e.target.value)}
                            placeholder="DEFINE NEW PROTOCOL..."
                            className="flex-1 bg-black/50 border border-green-500/30 rounded px-4 py-2 text-green-400 placeholder-green-500/30 focus:outline-none focus:border-green-400 focus:shadow-[0_0_15px_rgba(0,255,65,0.3)] transition-all font-mono"
                        />
                        <button
                            type="submit"
                            className="bg-green-500/20 text-green-400 border border-green-500/50 p-2 rounded hover:bg-green-500/40 hover:shadow-[0_0_15px_rgba(0,255,65,0.4)] transition-all"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </form>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                    {protocols.map((protocol) => {
                        const isDone = protocol.completedDates.includes(today);
                        return (
                            <div
                                key={protocol.id}
                                onClick={() => !isDone && toggleProtocol(protocol.id, today)}
                                className={`
                                    relative p-4 rounded-lg border transition-all duration-300 group cursor-pointer
                                    ${isDone
                                        ? "bg-green-500/10 border-green-500/50"
                                        : "bg-black/40 border-gray-800 hover:border-cyan-500/50 hover:bg-cyan-900/10"
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between relative z-10">
                                    <span className={`font-mono transition-colors ${isDone ? "text-green-400" : "text-gray-300 group-hover:text-cyan-300"}`}>
                                        {protocol.text}
                                    </span>
                                    <div className={`
                                        w-6 h-6 rounded border flex items-center justify-center transition-all
                                        ${isDone
                                            ? "bg-green-500 border-green-400 shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                                            : "border-gray-600 group-hover:border-cyan-400"
                                        }
                                    `}>
                                        {isDone && <Check className="w-4 h-4 text-black font-bold" />}
                                    </div>
                                </div>
                                {isDone && (
                                    <div className="absolute inset-0 bg-green-500/5 animate-pulse rounded-lg pointer-events-none"></div>
                                )}
                            </div>
                        );
                    })}
                    {protocols.length === 0 && (
                        <div className="text-center py-10 opacity-30">
                            <p className="font-mono text-xs">NO PROTOCOLS DEFINED</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Analytics */}
            <div className="space-y-6">
                <div className="glass-panel p-6 rounded-xl border border-cyan-500/30 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors duration-500"></div>
                    <h3 className="text-gray-400 font-mono text-xs relative z-10">DAILY EFFICIENCY</h3>
                    <p className="text-5xl font-display font-bold text-cyan-400 mt-2 relative z-10 text-glow">{currentEfficiency}%</p>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-green-500/30 h-[400px]">
                    <h3 className="text-sm font-display font-bold text-gray-400 mb-6 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        7-DAY PERFORMANCE
                    </h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00ff41" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00ff41" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 65, 0.1)" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#00ff41"
                                tick={{ fill: '#00ff41', fontSize: 10, fontFamily: 'var(--font-rajdhani)' }}
                                axisLine={{ stroke: '#00ff41', opacity: 0.3 }}
                                tickLine={false}
                            />
                            <YAxis
                                stroke="#00ff41"
                                tick={{ fill: '#00ff41', fontSize: 10, fontFamily: 'var(--font-rajdhani)' }}
                                axisLine={{ stroke: '#00ff41', opacity: 0.3 }}
                                tickLine={false}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(0, 20, 0, 0.9)', borderColor: '#00ff41', borderRadius: '8px' }}
                                itemStyle={{ color: '#00ff41' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="score"
                                stroke="#00ff41"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorScore)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default LifeProductivity;
