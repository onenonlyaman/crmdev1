import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../utils/socket';

const CustomersContext = createContext(null);
const API_URL = `${import.meta.env.VITE_API_URL}/api/crm/customers`;

export function CustomersProvider({ children }) {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(API_URL);
        setCustomers(response.data);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setCustomers([]);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const handleCrmUpdate = (update) => {
      if (update.model !== 'cust') return;

      setCustomers((prev) => {
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

  const addCustomer = async (customer) => {
    try {
      const res = await axios.post(API_URL, customer);
      setCustomers((prev) => {
        if (prev.some((c) => c.id === res.data.id)) return prev;
        return [res.data, ...prev];
      });
    } catch (err) {
      console.error('Error adding customer:', err);
    }
  };

  const updateCustomer = async (id, updates) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updates);
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? res.data : c))
      );
    } catch (err) {
      console.error('Error updating customer:', err);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Error deleting customer:', err);
    }
  };

  return (
    <CustomersContext.Provider
      value={{ customers, setCustomers, addCustomer, updateCustomer, deleteCustomer }}
    >
      {children}
    </CustomersContext.Provider>
  );
}

export const useCustomers = () => useContext(CustomersContext);
