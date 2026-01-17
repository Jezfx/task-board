'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { startOfWeek, format, addDays } from 'date-fns';

export type Project = {
  id: string;
  name: string;
  color: string;
  status: 'active' | 'archived';
  createdAt: number;
};

export type Task = {
  id: string;
  projectId: string;
  date: string; // 'YYYY-MM-DD'
  title: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
};

type State = {
  projects: Project[];
  tasks: Task[];
  weekStartISO: string; // selected Monday
  query: string;
};

type Actions = {
  addProject: (name: string, color: string, status?: 'active' | 'archived') => void;
  updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
  deleteProject: (id: string) => void;
  addTask: (projectId: string, date: string, title: string) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt'>>) => void;
  toggleTask: (id: string) => void;
  moveTaskToNextDay: (id: string) => void;
  deleteTask: (id: string) => void;
  setWeekStartISO: (iso: string) => void;
  setQuery: (q: string) => void;
};

const generateId = () => Math.random().toString(36).substring(2, 15);

// Get Monday of current week
const getCurrentWeekStart = () => {
  const today = new Date();
  const monday = startOfWeek(today, { weekStartsOn: 1 });
  return format(monday, 'yyyy-MM-dd');
};

// Seed data to match the screenshot
const getSeedData = (): { projects: Project[]; tasks: Task[] } => {
  const weekStart = getCurrentWeekStart();
  const monday = new Date(weekStart);

  const projects: Project[] = [
    {
      id: 'project-1',
      name: 'DIY Renovation',
      color: '#3b82f6', // blue
      status: 'active',
      createdAt: Date.now(),
    },
    {
      id: 'project-2',
      name: 'Garden Project',
      color: '#22c55e', // green
      status: 'active',
      createdAt: Date.now(),
    },
  ];

  const tasks: Task[] = [
    {
      id: 'task-1',
      projectId: 'project-1',
      date: format(monday, 'yyyy-MM-dd'),
      title: 'Buy wall paint',
      completed: true,
      createdAt: Date.now(),
      completedAt: Date.now(),
    },
    {
      id: 'task-2',
      projectId: 'project-1',
      date: format(monday, 'yyyy-MM-dd'),
      title: 'Prep living room',
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: 'task-3',
      projectId: 'project-1',
      date: format(addDays(monday, 1), 'yyyy-MM-dd'),
      title: 'First coat of paint',
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: 'task-4',
      projectId: 'project-1',
      date: format(addDays(monday, 5), 'yyyy-MM-dd'),
      title: 'Install shelving',
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: 'task-5',
      projectId: 'project-2',
      date: format(addDays(monday, 2), 'yyyy-MM-dd'),
      title: 'Plant bulbs',
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: 'task-6',
      projectId: 'project-2',
      date: format(addDays(monday, 6), 'yyyy-MM-dd'),
      title: 'Prune roses',
      completed: true,
      createdAt: Date.now(),
      completedAt: Date.now(),
    },
  ];

  return { projects, tasks };
};

const STORAGE_KEY = 'taskboard-storage';
const STORAGE_VERSION = 1;

// Get initial seed data
const initialSeedData = getSeedData();

export const useTaskBoardStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      projects: initialSeedData.projects,
      tasks: initialSeedData.tasks,
      weekStartISO: getCurrentWeekStart(),
      query: '',

      addProject: (name, color, status = 'active') => {
        const newProject: Project = {
          id: generateId(),
          name,
          color,
          status,
          createdAt: Date.now(),
        };
        set((state) => ({ projects: [...state.projects, newProject] }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          tasks: state.tasks.filter((t) => t.projectId !== id),
        }));
      },

      addTask: (projectId, date, title) => {
        const newTask: Task = {
          id: generateId(),
          projectId,
          date,
          title,
          completed: false,
          createdAt: Date.now(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  completedAt: !t.completed ? Date.now() : undefined,
                }
              : t
          ),
        }));
      },

      moveTaskToNextDay: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id) return t;
            const currentDate = new Date(t.date);
            const nextDay = addDays(currentDate, 1);
            return { ...t, date: format(nextDay, 'yyyy-MM-dd') };
          }),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      setWeekStartISO: (iso) => {
        set({ weekStartISO: iso });
      },

      setQuery: (q) => {
        set({ query: q });
      },
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      partialize: (state) => ({
        projects: state.projects,
        tasks: state.tasks,
        weekStartISO: state.weekStartISO,
      }),
    }
  )
);
