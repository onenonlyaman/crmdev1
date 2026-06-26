import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../utils/socket';

const LeadsContext = createContext(null);
const API_URL = `${import.meta.env.VITE_API_URL}/api/crm/leads`;

export function LeadsProvider({ children }) {
  const [leads, setLeads] = useState([]);

  // Fetch initial leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(API_URL);
        setLeads(response.data);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setLeads([]);
      }
    };
    fetchLeads();
  }, []);

  // Listen to WebSocket updates
  useEffect(() => {
    const handleCrmUpdate = (update) => {
      if (update.model !== 'lead') return;

      setLeads((prev) => {
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

  const addLead = async (lead) => {
    try {
      const res = await axios.post(API_URL, lead);
      // Local state is updated via the socket event, but we can optimistically update
      setLeads((prev) => {
        if (prev.some((l) => l.id === res.data.id)) return prev;
        return [res.data, ...prev];
      });
    } catch (err) {
      console.error('Error adding lead:', err);
    }
  };

  const updateLead = async (id, updates) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? res.data : l))
      );
    } catch (err) {
      console.error('Error updating lead:', err);
    }
  };

  const deleteLead = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setLeads((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  const safeLeads = Array.isArray(leads) ? leads : [];

  return (
    <LeadsContext.Provider value={{ leads: safeLeads, setLeads, addLead, updateLead, deleteLead }}>
      {children}
    </LeadsContext.Provider>
  );
}

export const useLeads = () => useContext(LeadsContext);
