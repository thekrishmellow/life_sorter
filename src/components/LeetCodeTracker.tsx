"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Calendar, Trophy, Image as ImageIcon, Activity as ActivityIcon, X, Eye, Trash2 } from "lucide-react";
import { LeetCodeSession } from "../types";

interface LeetCodeTrackerProps {
    sessions: LeetCodeSession[];
    addSession: (session: LeetCodeSession) => void;
    deleteSession: (id: string) => void;
}

const LeetCodeTracker: React.FC<LeetCodeTrackerProps> = ({ sessions, addSession, deleteSession }) => {
    const [images, setImages] = useState<string[]>([]);
    const [notes, setNotes] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedSession, setSelectedSession] = useState<LeetCodeSession | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages: string[] = [];
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                        newImages.push(reader.result);
                        if (newImages.length === e.target.files!.length) {
                            setImages(prev => [...prev, ...newImages]);
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (images.length < 4) {
            alert("PROTOCOL VIOLATION: Minimum 4 screenshots required for verification.");
            return;
        }

        const newSession: LeetCodeSession = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            screenshots: images,
            notes
        };

        addSession(newSession);
        setImages([]);
        setNotes("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Calculate streak
    const calculateStreak = () => {
        if (sessions.length === 0) return 0;

        // Check unique days
        const uniqueDays = new Set(sessions.map(s => new Date(s.date).toDateString()));
        let streak = 0;
        const today = new Date();
        const checkDate = new Date(today);

        // If no session today, check from yesterday
        if (!uniqueDays.has(checkDate.toDateString())) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        while (uniqueDays.has(checkDate.toDateString())) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }

        return streak;
    };

    const streak = calculateStreak();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel p-6 rounded-xl border border-green-500/30 hover:shadow-[0_0_30px_rgba(0,255,65,0.1)] transition-all duration-500">
                    <h2 className="text-xl font-display font-bold text-cyan-400 mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        UPLOAD EVIDENCE
                    </h2>

                    <div className="border-2 border-dashed border-green-500/30 rounded-lg p-8 text-center hover:bg-green-500/5 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                        onClick={() => fileInputRef.current?.click()}>
                        <div className="absolute inset-0 bg-green-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <ImageIcon className="w-12 h-12 text-green-500/50 mx-auto mb-2 group-hover:scale-110 group-hover:text-green-400 transition-all duration-300 relative z-10" />
                        <p className="font-mono text-green-400 relative z-10">CLICK TO UPLOAD SCREENSHOTS</p>
                        <p className="text-xs text-gray-500 mt-2 relative z-10">MINIMUM 4 REQUIRED FOR VALIDATION</p>
                    </div>

                    {images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="aspect-video relative rounded overflow-hidden border border-green-500/30 group">
                                    <Image
                                        src={img}
                                        alt="evidence"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setSelectedImage(img)}
                                            className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/40 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="SESSION NOTES..."
                        className="w-full bg-black/50 border border-green-500/30 rounded-lg p-3 mt-4 text-sm font-mono text-gray-300 focus:outline-none focus:border-green-400 focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] transition-all"
                        rows={3}
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={images.length < 4}
                        className={`w-full mt-4 py-3 rounded font-display font-bold tracking-wider transition-all duration-300 relative overflow-hidden group border ${images.length >= 4
                            ? "bg-green-600 hover:bg-green-500 text-black border-green-500 shadow-[0_0_15px_rgba(0,255,65,0.4)] hover:shadow-[0_0_25px_rgba(0,255,65,0.6)]"
                            : "bg-green-900/10 text-green-500/50 border-green-500/30 cursor-not-allowed hover:bg-green-900/20"
                            } `}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {images.length >= 4 ? (
                                <>
                                    <Upload className="w-4 h-4 animate-bounce" />
                                    LOG SESSION
                                </>
                            ) : (
                                <>
                                    <span>{4 - images.length} MORE SCREENSHOTS NEEDED</span>
                                </>
                            )}
                        </span>
                    </button>
                </div>

                {/* History */}
                <div className="space-y-4">
                    <h3 className="font-display font-bold text-gray-400 text-sm tracking-wider flex items-center gap-2">
                        <ActivityIcon className="w-4 h-4" /> RECENT SESSIONS
                    </h3>
                    {sessions.slice(0, 5).map((session) => (
                        <div key={session.id} className="glass-panel p-4 rounded-lg flex items-center justify-between group hover:border-green-500/50 transition-all duration-300">
                            <div>
                                <p className="text-cyan-400 font-mono text-sm group-hover:text-cyan-300 transition-colors">{new Date(session.date).toLocaleDateString()}</p>
                                <p className="text-gray-400 text-xs mt-1 group-hover:text-gray-300 transition-colors truncate max-w-[200px]">{session.notes || "No notes"}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-green-500/70 group-hover:text-green-400 transition-colors">
                                    <ImageIcon className="w-3 h-3" />
                                    <span className="text-xs font-mono">{session.screenshots.length}</span>
                                </div>
                                <button
                                    onClick={() => setSelectedSession(session)}
                                    className="p-1.5 rounded border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors"
                                    title="View Details"
                                >
                                    <Eye className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm("DELETE THIS SESSION?")) deleteSession(session.id);
                                    }}
                                    className="p-1.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                                    title="Delete Session"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {sessions.length === 0 && (
                        <div className="text-center py-8 opacity-30">
                            <p className="font-mono text-xs">NO DATA AVAILABLE</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-4xl w-full max-h-[90vh] aspect-video rounded-xl overflow-hidden border border-green-500/50 shadow-[0_0_50px_rgba(0,255,65,0.2)]">
                        <Image src={selectedImage} alt="Preview" fill className="object-contain" />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-red-500/50 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}

            {/* Session Details Modal */}
            {selectedSession && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setSelectedSession(null)}>
                    <div className="bg-black border border-green-500/30 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-display font-bold text-cyan-400">SESSION DETAILS</h3>
                                <p className="text-sm font-mono text-green-500">{new Date(selectedSession.date).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setSelectedSession(null)} className="text-gray-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xs font-mono text-gray-500 mb-2">NOTES</h4>
                                <div className="bg-green-900/10 p-4 rounded border border-green-500/20 text-gray-300 font-mono text-sm">
                                    {selectedSession.notes || "No notes recorded."}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-mono text-gray-500 mb-2">EVIDENCE ({selectedSession.screenshots.length})</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {selectedSession.screenshots.map((img, idx) => (
                                        <div key={idx} className="aspect-video relative rounded border border-green-500/20 overflow-hidden cursor-pointer hover:border-green-500/50 transition-colors" onClick={() => setSelectedImage(img)}>
                                            <Image src={img} alt={`Evidence ${idx + 1} `} fill className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Sidebar */}
            <div className="space-y-6">
                <div className="glass-panel p-6 rounded-xl border border-cyan-500/30 flex flex-col items-center justify-center text-center hover:shadow-[0_0_30px_rgba(0,255,255,0.15)] transition-all duration-500 group">
                    <div className="relative mb-2">
                        <div className="absolute inset-0 bg-yellow-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <Trophy className="w-12 h-12 text-yellow-500 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="text-gray-400 font-mono text-sm">CURRENT STREAK</h3>
                    <p className="text-5xl font-display font-bold text-white text-glow mt-2 group-hover:text-yellow-100 transition-colors">{streak}</p>
                    <p className="text-green-500 font-mono text-xs mt-1">DAYS</p>
                </div>

                <div className="glass-panel p-6 rounded-xl border border-green-500/30 hover:border-green-500/50 transition-all duration-500">
                    <h3 className="text-gray-400 font-mono text-sm mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        CONTRIBUTION GRAPH
                    </h3>
                    {/* Simple visualization of last 7 days */}
                    <div className="flex justify-between items-end h-24 gap-1">
                        {[...Array(7)].map((_, i) => {
                            const d = new Date();
                            d.setDate(d.getDate() - (6 - i));
                            const hasSession = sessions.some(s => new Date(s.date).toDateString() === d.toDateString());
                            return (
                                <div key={i} className="flex flex-col items-center gap-2 w-full group">
                                    <div className={`w - full rounded - sm transition - all duration - 500 ${hasSession ? 'bg-green-500 h-16 shadow-[0_0_10px_rgba(0,255,65,0.5)] group-hover:shadow-[0_0_15px_rgba(0,255,65,0.8)]' : 'bg-gray-800 h-2 group-hover:bg-gray-700'} `}></div>
                                    <span className="text-[10px] text-gray-500 font-mono group-hover:text-gray-300 transition-colors">{d.getDate()}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeetCodeTracker;
