import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../utils/socket';

const CampaignsContext = createContext(null);
const API_URL = `${import.meta.env.VITE_API_URL}/api/crm/campaigns`;

export function CampaignsProvider({ children }) {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(API_URL);
        setCampaigns(response.data);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setCampaigns([]);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const handleCrmUpdate = (update) => {
      if (update.model !== 'cmp') return;

      setCampaigns((prev) => {
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

  const addCampaign = async (campaign) => {
    try {
      const res = await axios.post(API_URL, campaign);
      setCampaigns((prev) => {
        if (prev.some((c) => c.id === res.data.id)) return prev;
        return [res.data, ...prev];
      });
    } catch (err) {
      console.error('Error adding campaign:', err);
    }
  };

  const updateCampaign = async (id, updates) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? res.data : c))
      );
    } catch (err) {
      console.error('Error updating campaign:', err);
    }
  };

  const deleteCampaign = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Error deleting campaign:', err);
    }
  };

  return (
    <CampaignsContext.Provider
      value={{ campaigns, setCampaigns, addCampaign, updateCampaign, deleteCampaign }}
    >
      {children}
    </CampaignsContext.Provider>
  );
}

export const useCampaigns = () => useContext(CampaignsContext);
