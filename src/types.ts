export interface Task {
    id: string;
    text: string;
    quadrant: 'do_first' | 'schedule' | 'delegate' | 'eliminate';
    completed: boolean;
    createdAt: number;
    completedAt?: number;
}

export interface LeetCodeSession {
    id: string;
    date: string;
    screenshots: string[]; // base64 or urls
    notes: string;
}

export interface Activity {
    id: string;
    category: string;
    description: string;
    hours: number;
    date: string;
    timestamp: number;
}
export interface LifeProtocol {
    id: string;
    text: string;
    completedDates: string[]; // dates formatted as YYYY-MM-DD
    createdAt: number;
}
