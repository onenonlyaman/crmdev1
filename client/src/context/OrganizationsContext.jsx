import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../utils/socket';

const OrganizationsContext = createContext(null);
const API_URL = `${import.meta.env.VITE_API_URL}/api/crm/organizations`;

export function OrganizationsProvider({ children }) {
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(API_URL);
        setOrganizations(response.data);
      } catch (err) {
        console.error('Error fetching organizations:', err);
        setOrganizations([]);
      }
    };
    fetchOrganizations();
  }, []);

  useEffect(() => {
    const handleCrmUpdate = (update) => {
      if (update.model !== 'org') return;

      setOrganizations((prev) => {
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

  const addOrganization = async (org) => {
    try {
      const res = await axios.post(API_URL, org);
      setOrganizations((prev) => {
        if (prev.some((o) => o.id === res.data.id)) return prev;
        return [res.data, ...prev];
      });
    } catch (err) {
      console.error('Error adding organization:', err);
    }
  };

  const updateOrganization = async (id, updates) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      setOrganizations((prev) =>
        prev.map((o) => (o.id === id ? res.data : o))
      );
    } catch (err) {
      console.error('Error updating organization:', err);
    }
  };

  const deleteOrganization = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setOrganizations((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error('Error deleting organization:', err);
    }
  };

  return (
    <OrganizationsContext.Provider value={{ organizations, addOrganization, updateOrganization, deleteOrganization }}>
      {children}
    </OrganizationsContext.Provider>
  );
}

export const useOrganizations = () => useContext(OrganizationsContext);
