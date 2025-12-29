"use client";

import React, { useState, useMemo } from "react";
import { Clock, Tag, Save, Activity as ActivityIcon, PieChart as PieChartIcon, Calendar as CalendarIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Activity } from "../types";

interface ActivityLoggerProps {
    activities: Activity[];
    addActivity: (activity: Activity) => void;
}

const ActivityLogger: React.FC<ActivityLoggerProps> = ({ activities, addActivity }) => {
    const [category, setCategory] = useState("Project");
    const [description, setDescription] = useState("");
    const [hours, setHours] = useState(1);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showStats, setShowStats] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (description && hours > 0) {
            addActivity({
                id: Date.now().toString(),
                category,
                description,
                hours,
                date: new Date().toISOString(),
                timestamp: Date.now()
            });
            setDescription("");
            setHours(1);
        }
    };

    const totalHours = activities.reduce((acc, curr) => acc + curr.hours, 0);

    // Aggregate data for the selected date
    const dailyData = useMemo(() => {
        const dayActivities = activities.filter(a => a.date.startsWith(selectedDate));
        const distribution: { [key: string]: number } = {};

        dayActivities.forEach(a => {
            distribution[a.category] = (distribution[a.category] || 0) + a.hours;
        });

        return Object.entries(distribution).map(([name, value]) => ({ name, value }));
    }, [activities, selectedDate]);

    const COLORS = ['#00ff41', '#00ffff', '#ffff00', '#ff00ff', '#ffa500'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel p-6 rounded-xl border border-green-500/30 hover:shadow-[0_0_30px_rgba(0,255,65,0.1)] transition-all duration-500">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-display font-bold text-cyan-400 flex items-center gap-2">
                            <ActivityIcon className="w-5 h-5" />
                            LOG ACTIVITY
                        </h2>
                        <button
                            onClick={() => setShowStats(!showStats)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono transition-all ${showStats ? 'bg-green-500/20 border-green-500 text-green-400' : 'border-green-500/30 text-gray-400 hover:text-green-400'}`}
                        >
                            <PieChartIcon className="w-4 h-4" />
                            {showStats ? 'HIDE STATS' : 'VIEW DAILY STATS'}
                        </button>
                    </div>

                    {showStats ? (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="relative group">
                                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500/50 w-4 h-4 group-hover:text-green-400 transition-colors pointer-events-none" />
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="bg-black/50 border border-green-500/30 rounded-lg p-2 pl-10 text-cyan-400 font-mono text-sm focus:outline-none focus:border-green-400 focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] cursor-pointer"
                                    />
                                </div>
                                <span className="text-gray-500 font-mono text-xs">TOTAL: {dailyData.reduce((acc, curr) => acc + curr.value, 0)}h</span>
                            </div>

                            <div className="h-[300px] w-full">
                                {dailyData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={dailyData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {dailyData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(0, 20, 0, 0.9)', borderColor: '#00ff41', color: '#fff', borderRadius: '8px' }}
                                                itemStyle={{ color: '#00ff41' }}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-30 gap-2">
                                        <PieChartIcon className="w-12 h-12 text-gray-500" />
                                        <p className="font-mono text-xs">NO DATA FOR THIS DATE</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 mb-1">CATEGORY</label>
                                    <div className="relative group">
                                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500/50 w-4 h-4 group-hover:text-green-400 transition-colors" />
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-black/50 border border-green-500/30 rounded-lg p-3 pl-10 text-cyan-400 focus:outline-none focus:border-green-400 appearance-none font-mono text-sm transition-all focus:shadow-[0_0_15px_rgba(0,255,65,0.2)]"
                                        >
                                            <option>Project</option>
                                            <option>Learning</option>
                                            <option>Meeting</option>
                                            <option>Hackathon</option>
                                            <option>Research</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-gray-400 mb-1">DURATION (HOURS)</label>
                                    <div className="relative group">
                                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500/50 w-4 h-4 group-hover:text-green-400 transition-colors" />
                                        <input
                                            type="number"
                                            min="0.5"
                                            step="0.5"
                                            value={hours}
                                            onChange={(e) => setHours(parseFloat(e.target.value))}
                                            className="w-full bg-black/50 border border-green-500/30 rounded-lg p-3 pl-10 text-cyan-400 focus:outline-none focus:border-green-400 font-mono text-sm transition-all focus:shadow-[0_0_15px_rgba(0,255,65,0.2)]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-1">DESCRIPTION</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="ACTIVITY DETAILS..."
                                    className="w-full bg-black/50 border border-green-500/30 rounded-lg p-3 text-sm font-mono text-gray-300 focus:outline-none focus:border-green-400 focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] transition-all"
                                    rows={3}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-green-600/20 border border-green-500/50 text-green-400 hover:bg-green-500/30 rounded font-display font-bold tracking-wider transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] group"
                            >
                                <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                SAVE ENTRY
                            </button>
                        </form>
                    )}
                </div>

                <div className="space-y-4">
                    <h3 className="font-display font-bold text-gray-400 text-sm tracking-wider">RECENT ACTIVITY</h3>
                    {activities.slice().reverse().slice(0, 5).map((activity) => (
                        <div key={activity.id} className="glass-panel p-4 rounded-lg flex items-center justify-between border-l-2 border-l-cyan-500 hover:border-l-green-400 hover:bg-green-900/10 transition-all duration-300 group">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-500/20 group-hover:border-green-500/50 transition-colors">{activity.category}</span>
                                    <span className="text-xs text-gray-500 font-mono group-hover:text-gray-400 transition-colors">{new Date(activity.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-300 text-sm group-hover:text-white transition-colors">{activity.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors">{activity.hours}h</p>
                            </div>
                        </div>
                    ))}
                    {activities.length === 0 && (
                        <div className="text-center py-8 opacity-30">
                            <p className="font-mono text-xs">NO ACTIVITY LOGGED</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div className="glass-panel p-6 rounded-xl border border-cyan-500/30 flex flex-col items-center justify-center text-center hover:shadow-[0_0_30px_rgba(0,255,255,0.15)] transition-all duration-500 group">
                    <div className="relative mb-2">
                        <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <Clock className="w-12 h-12 text-cyan-500 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="text-gray-400 font-mono text-sm">TOTAL HOURS</h3>
                    <p className="text-5xl font-display font-bold text-white text-glow mt-2 group-hover:text-cyan-100 transition-colors">{totalHours}</p>
                    <p className="text-green-500 font-mono text-xs mt-1">INVESTED</p>
                </div>
            </div>
        </div>
    );
};

export default ActivityLogger;
