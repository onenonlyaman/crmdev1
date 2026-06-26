import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../utils/socket';

const ContactsContext = createContext(null);
const API_URL = `${import.meta.env.VITE_API_URL}/api/crm/contacts`;

export function ContactsProvider({ children }) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(API_URL);
        setContacts(response.data);
      } catch (err) {
        console.error('Error fetching contacts:', err);
        setContacts([]);
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    const handleCrmUpdate = (update) => {
      if (update.model !== 'con') return;

      setContacts((prev) => {
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

  const addContact = async (contact) => {
    try {
      const res = await axios.post(API_URL, contact);
      setContacts((prev) => {
        if (prev.some((c) => c.id === res.data.id)) return prev;
        return [res.data, ...prev];
      });
    } catch (err) {
      console.error('Error adding contact:', err);
    }
  };

  const updateContact = async (id, updates) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? res.data : c))
      );
    } catch (err) {
      console.error('Error updating contact:', err);
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Error deleting contact:', err);
    }
  };

  return (
    <ContactsContext.Provider
      value={{ contacts, setContacts, addContact, updateContact, deleteContact }}
    >
      {children}
    </ContactsContext.Provider>
  );
}

export const useContacts = () => useContext(ContactsContext);
