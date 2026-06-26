/**
 * CommunicationsContext — client/src/context/CommunicationsContext.jsx
 */
import React, { createContext, useContext, useState } from 'react';

const CommunicationsContext = createContext(null);

export function CommunicationsProvider({ children }) {
  const [communications, setCommunications] = useState([]);

  const addCommunication = (communication) =>
    setCommunications(prev => [communication, ...prev]);

  const updateCommunication = (id, updates) =>
    setCommunications(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );

  const deleteCommunication = (id) =>
    setCommunications(prev => prev.filter(c => c.id !== id));

  return (
    <CommunicationsContext.Provider
      value={{ communications, setCommunications, addCommunication, updateCommunication, deleteCommunication }}
    >
      {children}
    </CommunicationsContext.Provider>
  );
}

export const useCommunications = () => useContext(CommunicationsContext);
