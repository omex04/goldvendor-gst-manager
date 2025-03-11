
export const TABLES = {
  SETTINGS: 'settings',
  INVOICES: 'invoices',
  CUSTOMERS: 'customers',
  INVOICE_ITEMS: 'invoice_items',
} as const;

type TableName = typeof TABLES[keyof typeof TABLES];

interface LocalDBData {
  [key: string]: any[];
}

class LocalDB {
  private data: LocalDBData;

  constructor() {
    // Initialize data from localStorage or create empty structure
    const savedData = localStorage.getItem('localdb');
    this.data = savedData ? JSON.parse(savedData) : {};
    
    // Initialize tables if they don't exist
    Object.values(TABLES).forEach(table => {
      if (!this.data[table]) {
        this.data[table] = [];
      }
    });
    
    this.saveToStorage();
  }

  private saveToStorage() {
    localStorage.setItem('localdb', JSON.stringify(this.data));
  }

  select(table: TableName, where?: { column: string; value: any }) {
    const records = this.data[table] || [];
    
    if (!where) {
      return [...records];
    }
    
    return records.filter(record => record[where.column] === where.value);
  }

  selectSingle(table: TableName, where: { column: string; value: any }) {
    const records = this.select(table, where);
    return records[0] || null;
  }

  insert(table: TableName, data: any | any[]) {
    try {
      const records = Array.isArray(data) ? data : [data];
      
      if (!this.data[table]) {
        this.data[table] = [];
      }
      
      this.data[table].push(...records);
      this.saveToStorage();
      
      return { data: records, error: null };
    } catch (error) {
      return { data: null, error: String(error) };
    }
  }

  update(table: TableName, data: any, where: { column: string; value: any }) {
    try {
      const records = this.data[table];
      const index = records.findIndex(record => record[where.column] === where.value);
      
      if (index !== -1) {
        this.data[table][index] = { ...this.data[table][index], ...data };
        this.saveToStorage();
      }
      
      return { error: null };
    } catch (error) {
      return { error: String(error) };
    }
  }

  upsert(table: TableName, data: any) {
    try {
      const id = data.id;
      
      if (!id) {
        // Insert new record with generated id
        const newRecord = { ...data, id: crypto.randomUUID() };
        return this.insert(table, newRecord);
      }
      
      // Try to find existing record
      const existing = this.selectSingle(table, { column: 'id', value: id });
      
      if (existing) {
        // Update existing record
        this.update(table, data, { column: 'id', value: id });
        return { data: [{ ...existing, ...data }], error: null };
      }
      
      // Insert new record with provided id
      return this.insert(table, data);
    } catch (error) {
      return { data: null, error: String(error) };
    }
  }

  delete(table: TableName, where: { column: string; value: any }) {
    try {
      const records = this.data[table];
      this.data[table] = records.filter(record => record[where.column] !== where.value);
      this.saveToStorage();
      
      return { error: null };
    } catch (error) {
      return { error: String(error) };
    }
  }
}

export const localDB = new LocalDB();

// Initialize or reset the local database
export function initializeLocalDatabase(): boolean {
  try {
    // Simply creating a new instance of LocalDB will initialize the tables if needed
    new LocalDB();
    return true;
  } catch (error) {
    console.error("Failed to initialize local database:", error);
    return false;
  }
}
