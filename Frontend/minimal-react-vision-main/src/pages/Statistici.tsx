// src/pages/Statistici.tsx
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as BarTooltip,
  Bar,
  LineChart,
  Line,
  Tooltip as LineTooltip,
} from "recharts";
import { BarChart3 } from "lucide-react";

interface Garment { id: number; name: string; type: string; imageUrl: string; }
interface Outfit  { id: number; name: string; timestamp: string; garments: Garment[]; }
interface Event   { id: number; date: string; title: string; description: string; outfitId: number | null; }

const API = axios.create({ baseURL: "http://localhost:8080/api" });
API.interceptors.request.use(cfg => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

// afișăm ultimele 6 luni
const MONTH_NAMES = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun"];

// paletă de 15 culori distincte (Google Charts default + câteva extra)
const PIE_COLORS = [
  "#3366CC", "#DC3912", "#FF9900", "#109618", "#990099",
  "#3B3EAC", "#0099C6", "#DD4477", "#66AA00", "#B82E2E",
  "#316395", "#994499", "#22AA99", "#AAAA11", "#6633CC",
];

const Statistici: React.FC = () => {
  // --- fetch data ---
  const { data: garments = [] } = useQuery<Garment[]>({
    queryKey: ["garments"],
    queryFn: () => API.get("/garments").then(r => r.data),
  });
  const { data: outfits = [] } = useQuery<Outfit[]>({
    queryKey: ["outfits"],
    queryFn: () => API.get("/outfit").then(r => r.data),
  });
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: () => API.get("/events").then(r => r.data),
  });

  // --- ultimele 6 luni ---
  const lastSix = useMemo(() => {
    const arr: { year: number; month: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      arr.push({ year: d.getFullYear(), month: d.getMonth() });
    }
    return arr;
  }, []);

  // --- Pie: distribuție tip articole ---
  const pieData = useMemo(() => {
    const byType: Record<string, number> = {};
    garments.forEach(g => {
      byType[g.type] = (byType[g.type] || 0) + 1;
    });
    const entries = Object.entries(byType);
    const total = entries.reduce((sum, [, cnt]) => sum + cnt, 0) || 1;

    return entries.map(([name, value], i) => ({
      name,
      value,
      color: PIE_COLORS[i % PIE_COLORS.length],
      percent: (value / total) // recharts oferă și el fraction, dar am calculat deja
    }));
  }, [garments]);

  // --- Bar: câte articole din outfituri pe lună + top3 articole ---
  type BarRow = { name: string; total: number; top: { name: string; cnt: number }[] };
  const barData = useMemo<BarRow[]>(() => {
    return lastSix.map(({ year, month }) => {
      const label = MONTH_NAMES[month];
      const evs = events.filter(e => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month && e.outfitId != null;
      });
      const cnt: Record<string, number> = {};
      evs.forEach(e => {
        const of = outfits.find(o => o.id === e.outfitId);
        of?.garments.forEach(g => {
          cnt[g.name] = (cnt[g.name] || 0) + 1;
        });
      });
      const entries = Object.entries(cnt).sort((a, b) => b[1] - a[1]);
      const total = entries.reduce((s, [, c]) => s + c, 0);
      const top3 = entries.slice(0, 3).map(([n, c]) => ({ name: n, cnt: c }));
      return { name: label, total, top: top3 };
    });
  }, [events, outfits, lastSix]);

  // --- Line: top 3 outfit-uri overall, afișate pe lună ---
  const lineData = useMemo(() => {
    const totCnt: Record<number, number> = {};
    events.forEach(e => {
      if (e.outfitId) totCnt[e.outfitId] = (totCnt[e.outfitId] || 0) + 1;
    });
    const topIds = Object.entries(totCnt)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([id]) => +id);

    return lastSix.map(({ year, month }) => {
      const label = MONTH_NAMES[month];
      const row: Record<string, any> = { name: label };
      topIds.forEach(id => {
        const cnt = events.filter(e => {
          const d = new Date(e.date);
          return d.getFullYear() === year &&
                 d.getMonth() === month &&
                 e.outfitId === id;
        }).length;
        const nm = outfits.find(o => o.id === id)?.name || `#${id}`;
        row[nm] = cnt;
      });
      return row;
    });
  }, [events, outfits, lastSix]);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-wardrobe-blue p-3 rounded-full">
          <BarChart3 size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold">Statistici</h1>
      </div>

      {/* primele două StatCard-uri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <StatCard title="Ținute salvate" value={outfits.length} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <StatCard title="Articole de îmbrăcăminte" value={garments.length} />
          </CardContent>
        </Card>
      </div>

      {/* Grafice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PIE */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuție tip articole</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                >
                  {pieData.map(e => (
                    <Cell key={e.name} fill={e.color} stroke={e.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* BAR */}
        <Card>
          <CardHeader>
            <CardTitle>Top 3 articole utilizate</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <BarTooltip
                  content={({ active, label }) =>
                    active && (
                      <div className="bg-white p-2 border rounded shadow-md text-sm">
                        <strong>{label}</strong>
                        {barData
                          .find(r => r.name === label)
                          ?.top.map((t, i) => (
                            <div key={i}>{t.name}: {t.cnt}</div>
                          ))}
                      </div>
                    )
                  }
                />
                <Bar dataKey="total" fill="#4C8EDD" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* LINE */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Top 3 ținute utilizate</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <LineTooltip
                  content={({ active, payload, label }) =>
                    active && (
                      <div className="bg-white p-2 border rounded shadow-md text-sm">
                        <strong>{label}</strong>
                        {payload.map((p, i) => (
                          <div key={i}>{p.name}: {p.value}</div>
                        ))}
                      </div>
                    )
                  }
                />
                {Object.keys(lineData[0] || {})
                  .filter(k => k !== "name")
                  .map((key, i) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      dot
                      stroke={PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Statistici;
