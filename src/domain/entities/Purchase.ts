
export interface Product = {
  id: string;
  credits: number;
  badge?: string;
  accent?: 'emerald' | 'sky' | 'amber';
  features: string[];
};