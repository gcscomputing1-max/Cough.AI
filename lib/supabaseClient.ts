
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (window as any).env?.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = (window as any).env?.SUPABASE_ANON_KEY || 'placeholder-key';

const useMock = 
  supabaseUrl.includes('placeholder') || 
  supabaseUrl.includes('your-project') || 
  !supabaseUrl.startsWith('https://');

const initializeStore = () => {
  const existing = localStorage.getItem('coughai_global_store_v2');
  if (existing) return JSON.parse(existing);

  const initial = {
    metrics: {
      demo_unlocked_count: 89,
      total_analyses: 2450,
      page_views: 12540,
      unique_visitors: 4820,
      bounce_rate: 28.5,
      avg_session: "5m 22s",
      active_now: 24,
      conversion_rate: 15.2,
      history: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        cpu: 40 + Math.random() * 20,
        ram: 55 + Math.random() * 15,
        bandwidth: 100 + Math.random() * 500
      }))
    },
    users: [
      { id: '1', email: 'dev@cough.ai', role: 'Super-Admin', status: 'Active', mfaEnabled: true, ipAddress: '192.168.0.1', lastLogin: new Date().toISOString(), location: 'Mountain View, US', deviceInfo: 'macOS / Chrome' },
      { id: '2', email: 'aadarshchockalingam095@gmail.com', role: 'Super-Admin', status: 'Active', mfaEnabled: true, ipAddress: '172.16.254.1', lastLogin: new Date().toISOString(), location: 'London, UK', deviceInfo: 'iOS / Safari' },
      { id: '3', email: 'moderator@cough.ai', role: 'Moderator', status: 'Active', mfaEnabled: false, ipAddress: '10.0.0.5', lastLogin: '2023-11-20T14:30:00Z', location: 'Toronto, CA', deviceInfo: 'Windows / Firefox' },
      { id: '4', email: 'spammer@malice.io', role: 'User', status: 'Banned', mfaEnabled: false, ipAddress: '203.0.113.42', lastLogin: '2023-10-01T12:00:00Z', location: 'Unknown', deviceInfo: 'Linux / Unknown' }
    ],
    cms: [
      { id: 'p1', title: 'Home Page', type: 'Page', status: 'Published', lastModified: '2023-12-01' },
      { id: 'p2', title: 'Terms of Service', type: 'Page', status: 'Published', lastModified: '2023-11-15' },
      { id: 'b1', title: 'Understanding AI Diagnostics', type: 'Post', status: 'Published', lastModified: '2023-12-05' }
    ],
    media: [
      { id: 'm1', name: 'hero_banner.webp', type: 'Image', size: '1.2MB', date: '2023-12-01' },
      { id: 'm2', name: 'diag_paper.pdf', type: 'PDF', size: '4.5MB', date: '2023-11-20' }
    ],
    logs: [
      { id: 'l1', userEmail: 'system', action: 'Automated Daily Backup Created', timestamp: new Date().toISOString(), severity: 'Info' },
      { id: 'l2', userEmail: 'dev@cough.ai', action: 'Updated CMS: Home Page', timestamp: new Date().toISOString(), severity: 'Info' }
    ],
    signins: []
  };
  localStorage.setItem('coughai_global_store_v2', JSON.stringify(initial));
  return initial;
};

const getStore = () => initializeStore();
const saveStore = (store: any) => localStorage.setItem('coughai_global_store_v2', JSON.stringify(store));

let demoSession: any = null;
const listeners = new Set<(event: string, session: any) => void>();

const mockSupabase = {
  auth: {
    getSession: async () => ({ data: { session: demoSession }, error: null }),
    getUser: async () => {
      if (!demoSession) return { data: { user: null }, error: null };
      return { data: { user: demoSession.user }, error: null };
    },
    signInWithPassword: async ({ email, password }: { email: string, password?: string }) => {
      await new Promise(r => setTimeout(r, 600));
      if (email === 'dev@cough.ai' && password !== 'GCV') return { data: null, error: { message: 'Invalid Admin Key' } };

      const store = getStore();
      const user = store.users.find((u: any) => u.email === email) || { id: 'u-' + Math.random(), email, role: 'User' };
      
      demoSession = { 
        access_token: 'tk-' + Math.random(),
        user: { id: user.id, email: user.email, user_metadata: { role: user.role } } 
      };

      store.metrics.page_views++;
      store.signins.unshift({ email, timestamp: new Date().toISOString() });
      saveStore(store);

      listeners.forEach(l => l('SIGNED_IN', demoSession));
      return { data: demoSession, error: null };
    },
    signInWithOAuth: async ({ provider }: { provider: string }) => {
      await new Promise(r => setTimeout(r, 800));
      demoSession = { access_token: 'o-' + Math.random(), user: { id: 'o-1', email: 'demo.user@gmail.com', user_metadata: { role: 'User' } } };
      listeners.forEach(l => l('SIGNED_IN', demoSession));
      window.location.hash = '/dashboard';
      return { data: {}, error: null };
    },
    signOut: async () => {
      demoSession = null;
      listeners.forEach(l => l('SIGNED_OUT', null));
      return { error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      listeners.add(callback);
      callback(demoSession ? 'SIGNED_IN' : 'INITIAL_SESSION', demoSession);
      return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } };
    },
  }
};

export const supabase = !useMock ? createClient(supabaseUrl, supabaseAnonKey) : (mockSupabase as any);

// Management Ops
export const trackPageView = () => {
  const store = getStore();
  store.metrics.page_views++;
  saveStore(store);
};
export const trackDemoUnlock = () => {
  const s = getStore(); s.metrics.demo_unlocked_count++; saveStore(s);
};
export const trackAnalysis = () => {
  const s = getStore(); s.metrics.total_analyses++; saveStore(s);
};

export const adminAction = {
  updateUser: (uid: string, data: any) => {
    const s = getStore();
    s.users = s.users.map((u: any) => u.id === uid ? { ...u, ...data } : u);
    saveStore(s);
  },
  deleteUser: (uid: string) => {
    const s = getStore();
    s.users = s.users.filter((u: any) => u.id !== uid);
    saveStore(s);
  },
  updateCMS: (cid: string, data: any) => {
    const s = getStore();
    s.cms = s.cms.map((c: any) => c.id === cid ? { ...c, ...data } : c);
    saveStore(s);
  }
};

export const getGlobalStore = () => getStore();
