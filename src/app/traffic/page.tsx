'use client';

import { useEffect, useState } from 'react';
import { Activity, MapPin, Users, MousePointerClick } from 'lucide-react';

interface TrafficLog {
  id: string;
  path: string;
  city: string;
  country: string;
  ip_address: string;
  created_at: string;
}

export default function TrafficDashboard() {
  const [logs, setLogs] = useState<TrafficLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/traffic/logs');
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (e) {
        console.error('Failed to load traffic', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  // Force dark mode for dashboard
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => document.documentElement.classList.remove('dark');
  }, []);

  const uniqueIps = new Set(logs.map(l => l.ip_address)).size;
  const recentLogs = logs.slice(0, 10);
  
  const pathCounts = logs.reduce((acc, log) => {
    acc[log.path] = (acc[log.path] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topPaths = Object.entries(pathCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const locCounts = logs.reduce((acc, log) => {
    if (!log.city || log.city === 'Unknown') return acc;
    const loc = `${log.city}, ${log.country}`;
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topLocs = Object.entries(locCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#09090b] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Stealth Traffic Dashboard</h1>
            <p className="text-zinc-400">Live analytics for proposal tracking.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-2 text-zinc-400 mb-2"><Activity className="w-4 h-4" /> Total Events</div>
            <div className="text-4xl font-bold">{loading ? '-' : logs.length}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-2 text-zinc-400 mb-2"><Users className="w-4 h-4" /> Unique Visitors (IPs)</div>
            <div className="text-4xl font-bold">{loading ? '-' : uniqueIps}</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-2 text-zinc-400 mb-2"><MousePointerClick className="w-4 h-4" /> Top Path</div>
            <div className="text-2xl font-bold truncate">{loading ? '-' : (topPaths[0]?.[0] || '/')}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-zinc-400"/> Top Paths</h3>
            <div className="space-y-3">
              {topPaths.map(([path, count]) => (
                <div key={path} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-mono text-zinc-300">{path}</span>
                    <span className="text-zinc-500">{count} visits</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(count / logs.length) * 100}%` }} />
                  </div>
                </div>
              ))}
              {topPaths.length === 0 && !loading && <div className="text-zinc-500 text-sm">No data yet</div>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-zinc-400"/> Top Locations</h3>
            <div className="space-y-3">
              {topLocs.map(([loc, count]) => (
                <div key={loc} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-300">{loc}</span>
                    <span className="text-zinc-500">{count} visits</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(count / logs.length) * 100}%` }} />
                  </div>
                </div>
              ))}
              {topLocs.length === 0 && !loading && <div className="text-zinc-500 text-sm">No location data yet</div>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
           <h3 className="font-semibold text-lg">Recent Feed</h3>
           <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="text-zinc-500 bg-zinc-950/50 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Path</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {recentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-800/50">
                      <td className="px-4 py-3 text-zinc-400">{new Date(log.created_at).toLocaleTimeString()}</td>
                      <td className="px-4 py-3 font-mono">{log.path}</td>
                      <td className="px-4 py-3">{log.city}, {log.country}</td>
                      <td className="px-4 py-3 text-zinc-500 font-mono text-xs">{log.ip_address}</td>
                    </tr>
                  ))}
                  {recentLogs.length === 0 && !loading && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-zinc-500">Waiting for events...</td></tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>

      </div>
    </div>
  );
}
