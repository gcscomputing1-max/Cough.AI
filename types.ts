
export type BlogCategory = 'AI' | 'COVID' | 'Asthma' | 'Respiratory Health';
export type UserRole = 'Super-Admin' | 'Moderator' | 'Author' | 'User';

// Add missing BlogPost interface for the health blog section
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  category: BlogCategory;
}

// Add missing HistoryItem interface for the user dashboard history
export interface HistoryItem {
  id: string;
  date: string;
  type: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  note?: string;
}

export interface CoughAnalysisResult {
  type: string;
  confidence: number;
  description: string;
  recommendations: string[];
  timestamp: string;
  severity: 'Low' | 'Medium' | 'High';
  note?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Banned' | 'Pending';
  mfaEnabled: boolean;
  ipAddress: string;
  lastLogin: string;
  deviceInfo: string;
  location: string;
}

export interface ActivityLog {
  id: string;
  userEmail: string;
  action: string;
  timestamp: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

export interface CMSContent {
  id: string;
  title: string;
  type: 'Page' | 'Post';
  status: 'Published' | 'Draft';
  lastModified: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
}

export interface SystemMetric {
  time: string;
  cpu: number;
  ram: number;
  bandwidth: number;
}