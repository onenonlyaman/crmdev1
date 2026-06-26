import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../utils/socket';

const CallLogsContext = createContext(null);
const API_URL = `${import.meta.env.VITE_API_URL}/api/crm/call-logs`;

export function CallLogsProvider({ children }) {
  const [callLogs, setCallLogs] = useState([]);

  useEffect(() => {
    const fetchCallLogs = async () => {
      try {
        const response = await axios.get(API_URL);
        setCallLogs(response.data);
      } catch (err) {
        console.error('Error fetching call logs:', err);
        setCallLogs([]);
      }
    };
    fetchCallLogs();
  }, []);

  useEffect(() => {
    const handleCrmUpdate = (update) => {
      if (update.model !== 'call') return;

      setCallLogs((prev) => {
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

  const addCallLog = async (callLog) => {
    try {
      const res = await axios.post(API_URL, callLog);
      setCallLogs((prev) => {
        if (prev.some((c) => c.id === res.data.id)) return prev;
        return [res.data, ...prev];
      });
    } catch (err) {
      console.error('Error adding call log:', err);
    }
  };

  const deleteCallLog = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCallLogs((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Error deleting call log:', err);
    }
  };

  return (
    <CallLogsContext.Provider value={{ callLogs, addCallLog, deleteCallLog }}>
      {children}
    </CallLogsContext.Provider>
  );
}

export const useCallLogs = () => useContext(CallLogsContext);
