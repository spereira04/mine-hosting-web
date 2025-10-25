export type ServerId = string;

export interface Server {
  id: ServerId;
  name: string;
  region: string;
  version: string;
  status: 'CREATING'|'RUNNING'|'STOPPED'|'ERROR';
  ip?: string;
  createdAt: string; // ISO
}

export interface NewServer {
  name: string;
  region: string;
  version: string;
}
