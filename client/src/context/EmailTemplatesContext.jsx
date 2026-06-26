import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../utils/socket';

const EmailTemplatesContext = createContext(null);
const API_URL = `${import.meta.env.VITE_API_URL}/api/crm/email-templates`;

export function EmailTemplatesProvider({ children }) {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(API_URL);
        setTemplates(response.data);
      } catch (err) {
        console.error('Error fetching email templates:', err);
        setTemplates([]);
      }
    };
    fetchTemplates();
  }, []);

  useEffect(() => {
    const handleCrmUpdate = (update) => {
      if (update.model !== 'tmpl') return;

      setTemplates((prev) => {
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

  const addTemplate = async (template) => {
    try {
      const res = await axios.post(API_URL, template);
      setTemplates((prev) => {
        if (prev.some((t) => t.id === res.data.id)) return prev;
        return [res.data, ...prev];
      });
    } catch (err) {
      console.error('Error adding template:', err);
    }
  };

  const updateTemplate = async (id, updates) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? res.data : t))
      );
    } catch (err) {
      console.error('Error updating template:', err);
    }
  };

  const deleteTemplate = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting template:', err);
    }
  };

  return (
    <EmailTemplatesContext.Provider value={{ templates, addTemplate, updateTemplate, deleteTemplate }}>
      {children}
    </EmailTemplatesContext.Provider>
  );
}

export const useEmailTemplates = () => useContext(EmailTemplatesContext);
