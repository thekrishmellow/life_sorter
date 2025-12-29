"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Task } from "../types";

interface AnalyticsProps {
    tasks: Task[];
}

const Analytics: React.FC<AnalyticsProps> = ({ tasks }) => {
    // Process data for the last 7 days
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });

        const completedCount = tasks.filter(t => {
            if (!t.completed || !t.completedAt) return false;
            const completedDate = new Date(t.completedAt);
            return completedDate.toDateString() === d.toDateString();
        }).length;

        data.push({ name: dateStr, completed: completedCount });
    }

    const totalCompleted = tasks.filter(t => t.completed).length;
    const completionRate = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-xl border border-green-500/30 text-center hover:shadow-[0_0_30px_rgba(0,255,65,0.15)] transition-all duration-500 group">
                    <h3 className="text-gray-400 font-mono text-xs group-hover:text-green-400 transition-colors">TOTAL COMPLETED</h3>
                    <p className="text-4xl font-display font-bold text-white mt-2 group-hover:text-green-300 transition-colors text-glow">{totalCompleted}</p>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-green-500/30 text-center hover:shadow-[0_0_30px_rgba(0,255,255,0.15)] transition-all duration-500 group">
                    <h3 className="text-gray-400 font-mono text-xs group-hover:text-cyan-400 transition-colors">COMPLETION RATE</h3>
                    <p className="text-4xl font-display font-bold text-cyan-400 mt-2 group-hover:text-cyan-300 transition-colors text-glow">{completionRate}%</p>
                </div>
                <div className="glass-panel p-6 rounded-xl border border-green-500/30 text-center hover:shadow-[0_0_30px_rgba(255,165,0,0.15)] transition-all duration-500 group">
                    <h3 className="text-gray-400 font-mono text-xs group-hover:text-orange-400 transition-colors">PENDING TASKS</h3>
                    <p className="text-4xl font-display font-bold text-orange-400 mt-2 group-hover:text-orange-300 transition-colors text-glow">{tasks.filter(t => !t.completed).length}</p>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-green-500/30 h-[400px] hover:border-green-500/50 transition-all duration-500">
                <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    WEEKLY PRODUCTIVITY
                </h3>
                <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 65, 0.1)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#00ff41"
                            tick={{ fill: '#00ff41', fontSize: 12, fontFamily: 'var(--font-rajdhani)' }}
                            axisLine={{ stroke: '#00ff41', opacity: 0.3 }}
                            tickLine={{ stroke: '#00ff41', opacity: 0.3 }}
                        />
                        <YAxis
                            stroke="#00ff41"
                            tick={{ fill: '#00ff41', fontSize: 12, fontFamily: 'var(--font-rajdhani)' }}
                            axisLine={{ stroke: '#00ff41', opacity: 0.3 }}
                            tickLine={{ stroke: '#00ff41', opacity: 0.3 }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(0, 20, 0, 0.9)', borderColor: '#00ff41', color: '#fff', borderRadius: '8px', boxShadow: '0 0 15px rgba(0,255,65,0.2)' }}
                            itemStyle={{ color: '#00ff41' }}
                            cursor={{ fill: 'rgba(0, 255, 65, 0.1)' }}
                        />
                        <Bar dataKey="completed" fill="#00ff41" radius={[4, 4, 0, 0]} barSize={40} className="hover:opacity-80 transition-opacity" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Analytics;
