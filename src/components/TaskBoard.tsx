"use client";

import React, { useState } from "react";
import { Plus, Trash2, CheckCircle, AlertCircle, Clock, Users, XCircle } from "lucide-react";
import { Task } from "../types";

interface TaskBoardProps {
    tasks: Task[];
    addTask: (text: string, quadrant: Task['quadrant']) => void;
    completeTask: (id: string) => void;
    deleteTask: (id: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, addTask, completeTask, deleteTask }) => {
    const [input, setInput] = useState("");
    const [selectedQuadrant, setSelectedQuadrant] = useState<Task['quadrant']>('do_first');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            addTask(input, selectedQuadrant);
            setInput("");
        }
    };

    const quadrants: { id: Task['quadrant'], label: string, color: string, border: string, icon: any }[] = [
        { id: 'do_first', label: 'URGENT + IMPORTANT', color: 'text-red-500', border: 'border-red-500/50', icon: AlertCircle },
        { id: 'schedule', label: 'NOT URGENT + IMPORTANT', color: 'text-yellow-500', border: 'border-yellow-500/50', icon: Clock },
        { id: 'delegate', label: 'URGENT + NOT IMPORTANT', color: 'text-orange-500', border: 'border-orange-500/50', icon: Users },
        { id: 'eliminate', label: 'NOT URGENT + NOT IMPORTANT', color: 'text-green-500', border: 'border-green-500/50', icon: XCircle },
    ];

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="relative group space-y-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="ENTER NEW PROTOCOL..."
                        className="w-full bg-black/50 border border-green-500/30 rounded-lg p-4 pl-12 text-cyan-400 placeholder-green-700/50 focus:outline-none focus:border-green-400 focus:shadow-[0_0_20px_rgba(0,255,65,0.2)] font-mono transition-all relative z-10"
                    />
                    <Plus className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500/50 group-hover:text-green-400 transition-colors z-10" />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {quadrants.map((quad) => (
                        <button
                            key={quad.id}
                            type="button"
                            onClick={() => setSelectedQuadrant(quad.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded border transition-all text-xs font-mono whitespace-nowrap ${selectedQuadrant === quad.id
                                ? `bg-black ${quad.border} ${quad.color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`
                                : "border-transparent text-gray-500 hover:text-gray-300 bg-black/30"
                                }`}
                        >
                            <quad.icon className="w-3 h-3" />
                            {quad.label}
                        </button>
                    ))}
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quadrants.map((quad) => (
                    <div key={quad.id} className={`glass-panel p-4 rounded-xl min-h-[300px] flex flex-col ${quad.border} hover:shadow-[0_0_30px_rgba(0,255,65,0.1)] transition-all duration-500`}>
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
                            <div className={`p-1.5 rounded bg-black/40 border ${quad.border}`}>
                                <quad.icon className={`w-4 h-4 ${quad.color}`} />
                            </div>
                            <h3 className={`font-display font-bold tracking-wider ${quad.color} text-sm`}>{quad.label}</h3>
                        </div>

                        <div className="space-y-3 flex-1 pr-2">
                            {tasks.filter(t => t.quadrant === quad.id && !t.completed).map((task) => (
                                <div key={task.id} className="group flex items-start justify-between bg-black/40 p-3 rounded border border-gray-800 hover:border-green-500/50 transition-all hover:translate-x-1 hover:bg-green-900/10 hover:shadow-[0_0_15px_rgba(0,255,65,0.1)]">
                                    <p className="text-sm font-mono text-gray-300 break-words flex-1 mr-2 group-hover:text-white transition-colors">{task.text}</p>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => completeTask(task.id)} className="text-green-500 hover:text-green-400 hover:scale-110 transition-transform">
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-400 hover:scale-110 transition-transform">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {tasks.filter(t => t.quadrant === quad.id && !t.completed).length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 gap-2">
                                    <div className="w-12 h-12 rounded-full border border-dashed border-gray-500 flex items-center justify-center">
                                        <quad.icon className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <p className="font-mono text-xs tracking-widest">NO ACTIVE PROTOCOLS</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskBoard;
