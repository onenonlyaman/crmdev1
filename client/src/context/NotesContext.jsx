import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../utils/socket';

const NotesContext = createContext(null);
const API_URL = `${import.meta.env.VITE_API_URL}/api/crm/notes`;

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(API_URL);
        setNotes(response.data);
      } catch (err) {
        console.error('Error fetching notes:', err);
        setNotes([]);
      }
    };
    fetchNotes();
  }, []);

  useEffect(() => {
    const handleCrmUpdate = (update) => {
      if (update.model !== 'note') return;

      setNotes((prev) => {
        switch (update.action) {
          case 'create':
            if (prev.some((item) => item.id === update.data.id)) return prev;
            return [update.data, ...prev];
          case 'update':
            return prev.map((item) => (item.id === update.data.id ? update.data : item));
          case 'delete':
            return prev.filter((item) => item.id !== update.data.id);
          default:
            return prev;
        }
      });
    };

    socket.on('crm:update', handleCrmUpdate);
    return () => {
      socket.off('crm:update', handleCrmUpdate);
    };
  }, []);

  const addNote = async (note) => {
    try {
      const res = await axios.post(API_URL, note);
      setNotes((prev) => {
        if (prev.some((n) => n.id === res.data.id)) return prev;
        return [res.data, ...prev];
      });
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  const updateNote = async (id, updates) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? res.data : n))
      );
    } catch (err) {
      console.error('Error updating note:', err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => useContext(NotesContext);
