
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { supabase, getGlobalStore, adminAction } from '../lib/supabaseClient';
import ProfileCard from '../components/ProfileCard';

type TabType = 'Health' | 'Monitoring' | 'Users' | 'CMS' | 'Nucleus';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('Health');
  const [store, setStore] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const isAdmin = user?.email === 'dev@cough.ai' || user?.email === 'aadarshchockalingam095@gmail.com';

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (mounted) {
        setUser(user);
        setStore(getGlobalStore());
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const refreshData = () => setStore(getGlobalStore());

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
        <p className="text-indigo-500 font-black tracking-[0.3em] text-xs uppercase animate-pulse">Syncing Admin Terminal...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Dashboard Control Sidebar */}
          <aside className="lg:w-80 flex flex-col gap-6">
            <ProfileCard user={user} />
            
            <nav className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 py-4">Main Menu</p>
              <SidebarItem active={activeTab === 'Health'} onClick={() => setActiveTab('Health')} icon="fa-house-chimney-medical" label="Patient View" />
              
              {isAdmin && (
                <>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 py-4 mt-4">Command Core</p>
                  <SidebarItem active={activeTab === 'Monitoring'} onClick={() => setActiveTab('Monitoring')} icon="fa-chart-network" label="Metrics & Traffic" />
                  <SidebarItem active={activeTab === 'Users'} onClick={() => setActiveTab('Users')} icon="fa-id-card-clip" label="User & Access" />
                  <SidebarItem active={activeTab === 'CMS'} onClick={() => setActiveTab('CMS')} icon="fa-database" label="Content Matrix" />
                  <SidebarItem active={activeTab === 'Nucleus'} onClick={() => setActiveTab('Nucleus')} icon="fa-microchip" label="Infrastructure" />
                </>
              )}
            </nav>

            {isAdmin && (
              <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
                <div className="relative z-10">
                  <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Live Connections</h4>
                  <div className="flex items-end gap-2 h-12 mb-4">
                    {store?.metrics?.history.slice(-8).map((h: any, i: number) => (
                      <div key={i} className="flex-1 bg-white/20 rounded-t-sm" style={{ height: `${h.bandwidth / 10}%` }}></div>
                    ))}
                  </div>
                  <p className="text-2xl font-black">{store?.metrics?.active_now} <span className="text-xs font-normal opacity-70">Active Sessions</span></p>
                </div>
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 blur-3xl rounded-full"></div>
              </div>
            )}
          </aside>

          {/* Main Workspace */}
          <main className="flex-1 space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {activeTab === 'Health' ? 'Respiratory Analytics' : 
                   activeTab === 'Monitoring' ? 'Intelligence Dashboard' :
                   activeTab === 'Users' ? 'Citizen HQ' : 
                   activeTab === 'CMS' ? 'Asset Management' : 'System Nucleus'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Monitoring secured biomedical traffic.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Network Online</span>
                  <span className="text-[10px] font-bold text-slate-400">Node-Alpha-42</span>
                </div>
                <button onClick={refreshData} className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-all hover:rotate-180 duration-500">
                  <i className="fa-solid fa-arrows-rotate"></i>
                </button>
              </div>
            </header>

            <AnimatePresence mode="wait">
              {/* Monitoring & Stats Tab */}
              {activeTab === 'Monitoring' && isAdmin && (
                <motion.div key="monitoring" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <AdminStatCard label="Total Views" value={store?.metrics?.page_views} icon="fa-eye" trend="+12.4%" />
                    <AdminStatCard label="Bounce Rate" value={`${store?.metrics?.bounce_rate}%`} icon="fa-arrow-up-right-from-square" trend="-2.1%" color="red" />
                    <AdminStatCard label="Unique Visitors" value={store?.metrics?.unique_visitors} icon="fa-users" trend="+5.6%" />
                    <AdminStatCard label="Conversion" value={`${store?.metrics?.conversion_rate}%`} icon="fa-bullseye-arrow" trend="+0.8%" color="green" />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Traffic Acquisition</h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={store?.metrics?.history}>
                            <defs>
                              <linearGradient id="colorBand" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                            <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                            <Area type="monotone" dataKey="bandwidth" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorBand)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-slate-950 p-8 rounded-[3rem] flex flex-col justify-center relative overflow-hidden">
                       <div className="relative z-10 text-center">
                          <i className="fa-solid fa-map-location-dot text-4xl text-indigo-500 mb-6"></i>
                          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Geographic Reach</h4>
                          <div className="space-y-4">
                             <GeoItem label="North America" value="45%" color="indigo" />
                             <GeoItem label="Europe" value="28%" color="purple" />
                             <GeoItem label="Asia" value="15%" color="blue" />
                             <GeoItem label="Others" value="12%" color="slate" />
                          </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* User Management Tab */}
              {activeTab === 'Users' && isAdmin && (
                <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                      <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                      <input type="text" placeholder="Search accounts, IP, or location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                    <div className="flex gap-2">
                       <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Create Profile</button>
                       <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Audit Permissions</button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <th className="px-8 py-5">Citizen Identity</th>
                          <th className="px-8 py-5">Network Access</th>
                          <th className="px-8 py-5">Metadata</th>
                          <th className="px-8 py-5">MFA State</th>
                          <th className="px-8 py-5 text-right">Terminal Ops</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {store?.users?.filter((u:any) => u.email.includes(searchTerm)).map((u: any) => (
                          <tr key={u.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-indigo-500">{u.email[0].toUpperCase()}</div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-black text-slate-900 dark:text-white">{u.email}</span>
                                  <span className="text-[9px] text-slate-400 font-bold uppercase">{u.location}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                               <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${u.role === 'Super-Admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>{u.role}</span>
                            </td>
                            <td className="px-8 py-5">
                               <div className="flex flex-col">
                                  <span className="text-[10px] text-slate-500 font-bold">{u.deviceInfo}</span>
                                  <span className="text-[9px] text-slate-400">{u.ipAddress}</span>
                               </div>
                            </td>
                            <td className="px-8 py-5">
                               <span className={`w-2.5 h-2.5 rounded-full inline-block ${u.mfaEnabled ? 'bg-green-500' : 'bg-red-400 opacity-50'}`}></span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => { adminAction.updateUser(u.id, { status: u.status === 'Active' ? 'Banned' : 'Active' }); refreshData(); }} className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs transition-all ${u.status === 'Active' ? 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-orange-500' : 'bg-orange-500 text-white'}`} title="Toggle Ban">
                                  <i className="fa-solid fa-user-slash"></i>
                                </button>
                                <button className="w-9 h-9 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400 hover:text-indigo-500" title="Security Reset">
                                  <i className="fa-solid fa-shield-keyhole"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Infrastructure Tab */}
              {activeTab === 'Nucleus' && isAdmin && (
                <motion.div key="nucleus" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SystemLoadCard title="Neural Computation (CPU)" data={store?.metrics?.history.map((h:any) => ({ v: h.cpu }))} color="#6366f1" current={store?.metrics?.history.at(-1)?.cpu} />
                    <SystemLoadCard title="Memory Allocation (RAM)" data={store?.metrics?.history.map((h:any) => ({ v: h.ram }))} color="#a855f7" current={store?.metrics?.history.at(-1)?.ram} />
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-10 flex items-center gap-2">
                      <i className="fa-solid fa-microchip"></i> Infrastructure Operations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <ActionBlock icon="fa-cloud-arrow-up" label="Create Snapshot" desc="Schedule complete site backup" />
                       <ActionBlock icon="fa-puzzle-piece" label="Plugin Manager" desc="Installed: 12 Active Modules" />
                       <ActionBlock icon="fa-link-slash" label="API Gateway" desc="Endpoint: /api/v4/secure" />
                    </div>
                  </div>

                  <div className="bg-slate-950 p-10 rounded-[3.5rem] border border-white/5 font-mono text-[10px]">
                    <div className="flex justify-between items-center mb-8">
                       <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Global Activity Logs</h3>
                       <button className="text-indigo-500 font-bold">CLEAR AUDIT</button>
                    </div>
                    <div className="space-y-3">
                       {store?.logs?.map((l: any) => (
                         <div key={l.id} className="flex gap-8 items-start opacity-60 hover:opacity-100 transition-opacity pb-3 border-b border-white/5">
                            <span className="text-slate-600">[{new Date(l.timestamp).toLocaleTimeString()}]</span>
                            <span className={`font-black w-24 ${l.severity === 'Warning' ? 'text-orange-500' : 'text-indigo-400'}`}>{l.severity}</span>
                            <span className="text-slate-400"><span className="text-indigo-600 font-bold">{l.userEmail}</span>: {l.action}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Standard Health Trends (Default View) */}
              {activeTab === 'Health' && (
                <motion.div key="health" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">My Detections</p>
                       <p className="text-4xl font-black text-slate-900 dark:text-white">14</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Last Severity</p>
                       <p className="text-4xl font-black text-green-500">LOW</p>
                    </div>
                    <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-500/20">
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Overall Score</p>
                       <p className="text-4xl font-black">92%</p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-100 dark:border-slate-800">
                     <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-10">Historical Confidence Trends</h3>
                     <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={Array.from({length: 10}).map((_, i) => ({ n: i, v: 85 + Math.random() * 10 }))}>
                              <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={4} fill="#6366f1" fillOpacity={0.05} />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

// Internal Components
const SidebarItem: React.FC<{ active: boolean, onClick: () => void, icon: string, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 font-black' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold'}`}>
    <i className={`fa-solid ${icon} text-sm`}></i>
    <span className="text-[11px] uppercase tracking-widest">{label}</span>
  </button>
);

const AdminStatCard: React.FC<{ label: string, value: any, icon: string, trend: string, color?: string }> = ({ label, value, icon, trend, color = "indigo" }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
    <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center text-${color}-500 mb-4`}>
       <i className={`fa-solid ${icon}`}></i>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
       <span className="text-2xl font-black text-slate-900 dark:text-white">{value}</span>
       <span className={`text-[9px] font-black uppercase ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>
    </div>
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform">
       <i className={`fa-solid ${icon} text-4xl`}></i>
    </div>
  </div>
);

const GeoItem: React.FC<{ label: string, value: string, color: string }> = ({ label, value, color }) => (
  <div className="flex items-center justify-between text-slate-400 group cursor-default">
     <span className="text-[10px] font-bold group-hover:text-white transition-colors">{label}</span>
     <div className="flex items-center gap-3">
        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
           <div className={`h-full bg-${color}-500`} style={{ width: value }}></div>
        </div>
        <span className="text-[10px] font-black text-white">{value}</span>
     </div>
  </div>
);

const SystemLoadCard: React.FC<{ title: string, data: any[], color: string, current: number }> = ({ title, data, color, current }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
    <div className="flex justify-between items-center mb-8">
       <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{title}</h3>
       <span className="text-xs font-black" style={{ color }}>{Math.round(current)}% Load</span>
    </div>
    <div className="h-40">
       <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
             <Area type="monotone" dataKey="v" stroke={color} fill={color} fillOpacity={0.05} />
          </AreaChart>
       </ResponsiveContainer>
    </div>
  </div>
);

const ActionBlock: React.FC<{ icon: string, label: string, desc: string }> = ({ icon, label, desc }) => (
  <button className="flex flex-col items-start p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20 transition-all text-left">
     <i className={`fa-solid ${icon} text-indigo-500 text-lg mb-4`}></i>
     <p className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-1">{label}</p>
     <p className="text-[9px] text-slate-400 font-bold uppercase">{desc}</p>
  </button>
);

export default Dashboard;
