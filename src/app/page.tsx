"use client";

import React, { useState, useEffect } from "react";
import MatrixBackground from "@/components/MatrixBackground";
import Header from "@/components/Header";
import TaskBoard from "@/components/TaskBoard";
import LeetCodeTracker from "@/components/LeetCodeTracker";
import ActivityLogger from "@/components/ActivityLogger";
import Analytics from "@/components/Analytics";
import LifeProductivity from "@/components/LifeProductivity";
import { Task, LeetCodeSession, Activity, LifeProtocol } from "@/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<LeetCodeSession[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [lifeProtocols, setLifeProtocols] = useState<LifeProtocol[]>([]);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [showAffirmation, setShowAffirmation] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("jarvis_tasks");
    const savedSessions = localStorage.getItem("jarvis_sessions");
    const savedActivities = localStorage.getItem("jarvis_activities");
    const savedProtocols = localStorage.getItem("jarvis_protocols");
    const savedPoints = localStorage.getItem("jarvis_points");
    const savedLevel = localStorage.getItem("jarvis_level");

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedActivities) setActivities(JSON.parse(savedActivities));
    if (savedProtocols) setLifeProtocols(JSON.parse(savedProtocols));
    if (savedPoints) setPoints(parseInt(savedPoints));
    if (savedLevel) setLevel(parseInt(savedLevel));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("jarvis_tasks", JSON.stringify(tasks));
    localStorage.setItem("jarvis_sessions", JSON.stringify(sessions));
    localStorage.setItem("jarvis_activities", JSON.stringify(activities));
    localStorage.setItem("jarvis_protocols", JSON.stringify(lifeProtocols));
    localStorage.setItem("jarvis_points", points.toString());
    localStorage.setItem("jarvis_level", level.toString());
  }, [tasks, sessions, activities, lifeProtocols, points, level, mounted]);

  if (!mounted) {
    return null; // or a loading spinner
  }

  const categorizeTask = (text: string): 'do_first' | 'schedule' | 'delegate' | 'eliminate' => {
    const lower = text.toLowerCase();
    const isUrgent = lower.includes('urgent') || lower.includes('now') || lower.includes('asap') || lower.includes('today') || lower.includes('due') || lower.includes('deadline');
    const isImportant = lower.includes('important') || lower.includes('critical') || lower.includes('must') || lower.includes('project') || lower.includes('study') || lower.includes('exam') || lower.includes('work');

    if (isUrgent && isImportant) return 'do_first';
    if (!isUrgent && isImportant) return 'schedule';
    if (isUrgent && !isImportant) return 'delegate';
    return 'schedule'; // Default to schedule
  };

  const addTask = (text: string, quadrant: Task['quadrant']) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text,
      quadrant,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks([...tasks, newTask]);
  };

  const completeTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: true, completedAt: Date.now() } : t));
    addPoints(50);
    showRandomAffirmation();
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addLifeProtocol = (text: string) => {
    const newProtocol: LifeProtocol = {
      id: Date.now().toString(),
      text,
      completedDates: [],
      createdAt: Date.now()
    };
    setLifeProtocols([...lifeProtocols, newProtocol]);
  };

  const toggleLifeProtocol = (id: string, date: string) => {
    setLifeProtocols(lifeProtocols.map(p => {
      if (p.id !== id) return p;
      if (p.completedDates.includes(date)) return p;

      addPoints(25);
      showRandomAffirmation();

      return {
        ...p,
        completedDates: [...p.completedDates, date]
      };
    }));
  };

  const addSession = (session: LeetCodeSession) => {
    setSessions([session, ...sessions]); // Add new session to the beginning
    addPoints(100);
    showRandomAffirmation();
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const addActivity = (activity: Activity) => {
    setActivities([...activities, activity]);
    addPoints(Math.floor(activity.hours * 20));
  };

  const addPoints = (amount: number) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    if (newPoints >= level * 1000) {
      setLevel(level + 1);
    }
  };

  const handleReset = () => {
    // Prevent the save effect from running
    setMounted(false);

    // Clear state immediately
    setTasks([]);
    setSessions([]);
    setActivities([]);
    setLifeProtocols([]);
    setPoints(0);
    setLevel(1);

    // Clear storage and reload
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 100);
  };

  const affirmations = [
    "EXCELLENT WORK, SIR.",
    "PROTOCOL COMPLETED SUCCESSFULLY.",
    "SYSTEM EFFICIENCY INCREASED.",
    "YOU ARE UNSTOPPABLE.",
    "ANOTHER STEP TOWARDS PERFECTION.",
    "DATA PROCESSED. WELL DONE.",
    "KEEP PUSHING THE BOUNDARIES.",
    "THE FUTURE IS BUILT BY YOU."
  ];

  const showRandomAffirmation = () => {
    const random = affirmations[Math.floor(Math.random() * affirmations.length)];
    setShowAffirmation(random);
    setTimeout(() => setShowAffirmation(null), 3000);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <MatrixBackground />

      <div className="relative z-10 flex flex-col h-screen">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} points={points} level={level} onReset={handleReset} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {activeTab === "tasks" && (
              <TaskBoard
                tasks={tasks}
                addTask={addTask}
                completeTask={completeTask}
                deleteTask={deleteTask}
              />
            )}
            {activeTab === "life" && (
              <LifeProductivity
                protocols={lifeProtocols}
                addProtocol={addLifeProtocol}
                toggleProtocol={toggleLifeProtocol}
              />
            )}
            {activeTab === "leetcode" && (
              <LeetCodeTracker
                sessions={sessions}
                addSession={addSession}
                deleteSession={deleteSession}
              />
            )}
            {activeTab === "activity" && (
              <ActivityLogger
                activities={activities}
                addActivity={addActivity}
              />
            )}
            {activeTab === "analytics" && (
              <Analytics
                tasks={tasks}
              />
            )}
          </div>
        </div>

        {showAffirmation && (
          <div className="fixed bottom-8 right-8 bg-green-500/20 border border-green-500/50 text-green-400 px-6 py-3 rounded-lg backdrop-blur-md animate-in slide-in-from-right fade-in duration-500 shadow-[0_0_20px_rgba(0,255,65,0.3)]">
            <p className="font-display font-bold tracking-wider typing-effect">{showAffirmation}</p>
          </div>
        )}
      </div>
    </main>
  );
}

const TypingEffect = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return <p className="font-display font-bold text-green-400 text-lg text-glow-green">{displayedText}<span className="animate-pulse">_</span></p>;
};
