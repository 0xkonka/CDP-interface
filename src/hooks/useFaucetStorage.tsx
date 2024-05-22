import { useEffect, useState } from 'react';

type FaucetEntry = {
  account: string;
  address: string;
};

// Hook to manage faucet storage
function useFaucetStorage() {
  const [storage, setStorage] = useState<FaucetEntry[]>([]);

  // Effect to load the stored data initially
  useEffect(() => {
    const storedData = localStorage.getItem('faucetStorage');
    if (storedData) {
      setStorage(JSON.parse(storedData));
    }
  }, []);

  // Function to update the LocalStorage
  const updateLocalStorage = (newStorage: FaucetEntry[]) => {
    try {
      const serializedData = JSON.stringify(newStorage);
      localStorage.setItem('faucetStorage', serializedData);
    } catch (error) {
      console.error('Failed to save to LocalStorage', error);
    }
  };

  // Helper function to check if an entry exists
  const entryExists = (entryToCheck: FaucetEntry): boolean => {
    return storage.some(
      (entry) =>
        entry.account === entryToCheck.account && entry.address === entryToCheck.address
    );
  };

  // Function to add a new entry if it doesn't exist
  const addToFaucetStorage = (newEntry: FaucetEntry): void => {
    if (!entryExists(newEntry)) {
        setStorage((prevStorage) => {
          const updatedStorage = [...prevStorage, newEntry];
          updateLocalStorage(updatedStorage);
          return updatedStorage;
        });
    }
  };
  return { storage, entryExists, addToFaucetStorage };
}

export default useFaucetStorage;
