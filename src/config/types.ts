export interface Config {
  dbPath: string;
  passwordHash: string;
  lastPasswordCheck: number;
  passwordCheckInterval: number;
  outputFormat: "table" | "list";
}

export interface Env {
  id?: number;
  key: string;
  value: string;
  project: string;
  encrypted: boolean;
  createdAt?: string;
  updatedAt?: string;
}
