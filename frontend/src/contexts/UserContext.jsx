import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let stored = localStorage.getItem('memehustle_user_id');
    if (!stored) {
      stored = uuidv4();
      localStorage.setItem('memehustle_user_id', stored);
    }
    setUserId(stored);
  }, []);

  return (
    <UserContext.Provider value={{ userId }}>
      {children}
    </UserContext.Provider>
  );
}
