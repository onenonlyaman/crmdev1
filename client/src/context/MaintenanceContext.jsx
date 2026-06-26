import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../utils/socket';

const MaintenanceContext = createContext(null);
const API_URL = `${import.meta.env.VITE_API_URL}/api/crm/maintenance`;

export function MaintenanceProvider({ children }) {
  const [maintenanceItems, setMaintenanceItems] = useState([]);

  useEffect(() => {
    const fetchMaintenanceItems = async () => {
      try {
        const response = await axios.get(API_URL);
        setMaintenanceItems(response.data);
      } catch (err) {
        console.error('Error fetching maintenance items:', err);
        setMaintenanceItems([]);
      }
    };
    fetchMaintenanceItems();
  }, []);

  useEffect(() => {
    const handleCrmUpdate = (update) => {
      if (update.model !== 'mnt') return;

      setMaintenanceItems((prev) => {
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

  const addMaintenance = async (item) => {
    try {
      const res = await axios.post(API_URL, item);
      setMaintenanceItems((prev) => {
        if (prev.some((m) => m.id === res.data.id)) return prev;
        return [res.data, ...prev];
      });
    } catch (err) {
      console.error('Error adding maintenance:', err);
    }
  };

  const updateMaintenance = async (id, updates) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      setMaintenanceItems((prev) =>
        prev.map((m) => (m.id === id ? res.data : m))
      );
    } catch (err) {
      console.error('Error updating maintenance:', err);
    }
  };

  const deleteMaintenance = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMaintenanceItems((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Error deleting maintenance:', err);
    }
  };

  return (
    <MaintenanceContext.Provider
      value={{ maintenanceItems, setMaintenanceItems, addMaintenance, updateMaintenance, deleteMaintenance }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
}

export const useMaintenance = () => useContext(MaintenanceContext);
