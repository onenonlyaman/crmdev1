/**
 * ContractsContext — client/src/context/ContractsContext.jsx
 */
import React, { createContext, useContext, useState } from 'react';

const ContractsContext = createContext(null);

export function ContractsProvider({ children }) {
  const [contracts, setContracts] = useState([]);

  const addContract = (contract) =>
    setContracts(prev => [contract, ...prev]);

  const updateContract = (id, updates) =>
    setContracts(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );

  const deleteContract = (id) =>
    setContracts(prev => prev.filter(c => c.id !== id));

  return (
    <ContractsContext.Provider
      value={{ contracts, setContracts, addContract, updateContract, deleteContract }}
    >
      {children}
    </ContractsContext.Provider>
  );
}

export const useContracts = () => useContext(ContractsContext);
