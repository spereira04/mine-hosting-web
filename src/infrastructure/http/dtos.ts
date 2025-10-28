export type ServerDTO = {
  id: string;
  name: string;
  region: string;   // 👈 embed del backend
  version: string; 
  status: string;
  ip?: string;
  createdAt: number;
};

export type RegionDTO = { id: string; name: string };
export type VersionDTO = { id: string; label: string };

export type CreateServerRequestDTO = {
  name: string;
  regionId: string;
  versionId: string;
  type: string;
};