import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../utils/socket';

const TasksContext = createContext(null);
const API_URL = `${import.meta.env.VITE_API_URL}/api/crm/tasks`;

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setTasks([]);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const handleCrmUpdate = (update) => {
      if (update.model !== 'task') return;

      setTasks((prev) => {
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

  const addTask = async (task) => {
    try {
      const res = await axios.post(API_URL, task);
      setTasks((prev) => {
        if (prev.some((t) => t.id === res.data.id)) return prev;
        return [res.data, ...prev];
      });
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? res.data : t))
      );
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const toggleTask = async (id) => {
    try {
      const taskToToggle = tasks.find(t => t.id === id);
      if (!taskToToggle) return;
      const res = await axios.put(`${API_URL}/${id}`, { done: !taskToToggle.done });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? res.data : t))
      );
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export const useTasks = () => useContext(TasksContext);
