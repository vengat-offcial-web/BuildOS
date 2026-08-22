import { create } from 'zustand';
import { initialWorkerNotesData } from '../data';
import { useNotificationStore } from './useNotificationStore';

const safeGetStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const safeSetStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const useWorkerNotesStore = create((set, get) => ({
  workerNotes: safeGetStorage('buildos_worker_notes', initialWorkerNotesData),

  addWorkerNote: (noteData) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newNote = {
      id: Date.now(),
      workerName: noteData.workerName || 'Mathan',
      text: noteData.text,
      category: noteData.category || 'General Note',
      senderRole: noteData.senderRole || 'admin',
      senderName: noteData.senderName || (noteData.senderRole === 'worker' ? noteData.workerName || 'Worker' : 'Rajesh Kumar (Project Director)'),
      time: `Today, ${timeStr}`,
      isUrgent: !!noteData.isUrgent,
      isPinned: false
    };

    set(state => {
      const updated = [newNote, ...state.workerNotes];
      safeSetStorage('buildos_worker_notes', updated);
      return { workerNotes: updated };
    });

    const notifStore = useNotificationStore.getState();
    notifStore.logActivity(`Worker Chat Note: ${newNote.workerName}`, 'Site Communication', `Note: ${newNote.category}`, newNote.isUrgent ? 'purple' : 'lime');

    if (noteData.senderRole === 'admin') {
      notifStore.addNotification(
        `New Message from Site Admin`,
        `Admin sent note to ${newNote.workerName}: "${newNote.text.slice(0, 60)}..."`,
        "Worker Chat",
        "purple"
      );
    }
    return newNote;
  },

  deleteWorkerNote: (noteId) => {
    set(state => {
      const updated = state.workerNotes.filter(n => n.id !== Number(noteId));
      safeSetStorage('buildos_worker_notes', updated);
      return { workerNotes: updated };
    });
  },

  togglePinNote: (noteId) => {
    set(state => {
      const updated = state.workerNotes.map(n => n.id === Number(noteId) ? { ...n, isPinned: !n.isPinned } : n);
      safeSetStorage('buildos_worker_notes', updated);
      return { workerNotes: updated };
    });
  },

  getWorkerNotes: (name) => {
    const notes = get().workerNotes;
    if (!name) return notes;
    return notes.filter(n => n.workerName?.toLowerCase() === name.toLowerCase());
  },

  setWorkerNotes: (updater) => {
    set(state => {
      const updated = typeof updater === 'function' ? updater(state.workerNotes) : updater;
      safeSetStorage('buildos_worker_notes', updated);
      return { workerNotes: updated };
    });
  }
}));

export default useWorkerNotesStore;
