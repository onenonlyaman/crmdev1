import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../utils/socket';

const OpportunitiesContext = createContext(null);
const API_URL = `${import.meta.env.VITE_API_URL}/api/crm/opportunities`;

export function OpportunitiesProvider({ children }) {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get(API_URL);
        setOpportunities(response.data);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setOpportunities([]);
      }
    };
    fetchOpportunities();
  }, []);

  useEffect(() => {
    const handleCrmUpdate = (update) => {
      if (update.model !== 'opp') return;

      setOpportunities((prev) => {
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

  const addOpportunity = async (opp) => {
    try {
      const res = await axios.post(API_URL, opp);
      setOpportunities((prev) => {
        if (prev.some((o) => o.id === res.data.id)) return prev;
        return [res.data, ...prev];
      });
    } catch (err) {
      console.error('Error adding opportunity:', err);
    }
  };

  const updateOpportunity = async (id, updates) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      setOpportunities((prev) =>
        prev.map((o) => (o.id === id ? res.data : o))
      );
    } catch (err) {
      console.error('Error updating opportunity:', err);
    }
  };

  const deleteOpportunity = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error('Error deleting opportunity:', err);
    }
  };

  return (
    <OpportunitiesContext.Provider
      value={{ opportunities, setOpportunities, addOpportunity, updateOpportunity, deleteOpportunity }}
    >
      {children}
    </OpportunitiesContext.Provider>
  );
}

export const useOpportunities = () => useContext(OpportunitiesContext);
