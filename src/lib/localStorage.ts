
// Local storage database service that replaces Supabase

// Generate a random UUID for IDs
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Generic function to get data from local storage
const getStorageData = <T>(key: string, defaultValue: T[]): T[] => {
  const storedData = localStorage.getItem(key);
  if (!storedData) {
    return defaultValue;
  }
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error(`Error parsing ${key} data:`, error);
    return defaultValue;
  }
};

// Generic function to save data to local storage
const setStorageData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Table names
export const TABLES = {
  INVOICES: 'invoices',
  INVOICE_ITEMS: 'invoice_items',
  CUSTOMERS: 'customers',
  SETTINGS: 'settings'
};

// Local database operations
export const localDB = {
  // Select operation with filtering
  select: <T>(tableName: string, filter?: { column: string, value: any }): T[] => {
    const data = getStorageData<T>(tableName, []);
    
    if (!filter) {
      return data;
    }
    
    return data.filter((item: any) => item[filter.column] === filter.value);
  },
  
  // Select a single record
  selectSingle: <T>(tableName: string, filter?: { column: string, value: any }): T | null => {
    const results = localDB.select<T>(tableName, filter);
    return results.length > 0 ? results[0] : null;
  },
  
  // Insert operation
  insert: <T>(tableName: string, data: T | T[]): { data: T[], error: null } | { data: null, error: string } => {
    try {
      const existingData = getStorageData<T>(tableName, []);
      const dataArray = Array.isArray(data) ? data : [data];
      
      // Add IDs if not present
      const dataWithIds = dataArray.map((item: any) => {
        if (!item.id) {
          return { ...item, id: generateId() };
        }
        return item;
      });
      
      const updatedData = [...existingData, ...dataWithIds];
      setStorageData(tableName, updatedData);
      
      return { data: dataWithIds as T[], error: null };
    } catch (error: any) {
      console.error(`Error inserting into ${tableName}:`, error);
      return { data: null, error: error.message };
    }
  },
  
  // Update operation
  update: <T>(tableName: string, data: Partial<T>, filter: { column: string, value: any }): { data: T | null, error: null | string } => {
    try {
      const existingData = getStorageData<T>(tableName, []);
      let updated = false;
      
      const updatedData = existingData.map((item: any) => {
        if (item[filter.column] === filter.value) {
          updated = true;
          return { ...item, ...data };
        }
        return item;
      });
      
      setStorageData(tableName, updatedData);
      
      if (!updated) {
        return { data: null, error: 'No record found to update' };
      }
      
      // Return the updated record
      const updatedRecord = updatedData.find((item: any) => item[filter.column] === filter.value);
      return { data: updatedRecord as T, error: null };
    } catch (error: any) {
      console.error(`Error updating in ${tableName}:`, error);
      return { data: null, error: error.message };
    }
  },
  
  // Upsert operation (update or insert)
  upsert: <T>(tableName: string, data: T | T[], primaryKey: string = 'id'): { data: T[], error: null } | { data: null, error: string } => {
    try {
      const existingData = getStorageData<T>(tableName, []);
      const dataArray = Array.isArray(data) ? data : [data];
      
      // For each item, either update existing or insert new
      const result: T[] = [];
      const newData = existingData.slice();
      
      dataArray.forEach((item: any) => {
        // Generate ID if not present
        if (!item[primaryKey]) {
          item[primaryKey] = generateId();
        }
        
        const index = newData.findIndex((record: any) => record[primaryKey] === item[primaryKey]);
        
        if (index >= 0) {
          // Update existing record
          newData[index] = { ...newData[index], ...item };
          result.push(newData[index]);
        } else {
          // Add new record
          newData.push(item);
          result.push(item);
        }
      });
      
      setStorageData(tableName, newData);
      return { data: result, error: null };
    } catch (error: any) {
      console.error(`Error upserting into ${tableName}:`, error);
      return { data: null, error: error.message };
    }
  },
  
  // Delete operation
  delete: <T>(tableName: string, filter: { column: string, value: any }): { error: null | string } => {
    try {
      const existingData = getStorageData<T>(tableName, []);
      const filteredData = existingData.filter((item: any) => item[filter.column] !== filter.value);
      
      setStorageData(tableName, filteredData);
      
      return { error: null };
    } catch (error: any) {
      console.error(`Error deleting from ${tableName}:`, error);
      return { error: error.message };
    }
  },
  
  // Clear all data from storage
  clearAll: (): void => {
    Object.values(TABLES).forEach(tableName => {
      localStorage.removeItem(tableName);
    });
  }
};

// Initialize database with sample data if needed
export const initializeLocalDatabase = () => {
  // Add initialization logic here if needed
  // For now, we'll just ensure all tables exist
  Object.values(TABLES).forEach(tableName => {
    if (!localStorage.getItem(tableName)) {
      localStorage.setItem(tableName, JSON.stringify([]));
    }
  });
};
