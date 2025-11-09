export type ServerDTO = {
  InstanceId: string;
  ServerName: string;
  Region: string;   // 👈 embed del backend
  Version: string; 
  status: string;
  Type: string;
  PublicIp?: string;
  LaunchedAt: string;
};

export type RegionDTO = { id: string; name: string };
export type VersionDTO = { id: string; label: string };

export type CreateServerRequestDTO = {
  name: string;
  regionId: string;
  versionId: string;
  type: string;
};