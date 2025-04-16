
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line } from "recharts";

const Statistici = () => {
  const colorData = [
    { name: 'Albastru', value: 40, color: '#4C8EDD' },
    { name: 'Bej', value: 30, color: '#F5E9D9' },
    { name: 'Negru', value: 15, color: '#333333' },
    { name: 'Alb', value: 15, color: '#FFFFFF' },
  ];
  
  const usageData = [
    { name: 'Ian', tricouri: 5, bluze: 4, pantaloni: 3 },
    { name: 'Feb', tricouri: 3, bluze: 2, pantaloni: 4 },
    { name: 'Mar', tricouri: 4, bluze: 4, pantaloni: 5 },
    { name: 'Apr', tricouri: 6, bluze: 3, pantaloni: 2 },
    { name: 'Mai', tricouri: 8, bluze: 5, pantaloni: 4 },
    { name: 'Iun', tricouri: 9, bluze: 3, pantaloni: 3 },
  ];

  return (
    <Layout>
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-wardrobe-blue p-3 rounded-full">
          <BarChart3 size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold">Statistici</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <StatCard title="Ținute salvate" value={8} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <StatCard title="Articole de îmbrăcăminte" value={24} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <StatCard title="Articole favorite" value={5} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <StatCard title="Culori dominante" value={3} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Distribuție culori</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={colorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {colorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color === '#FFFFFF' ? '#CCCCCC' : entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Utilizare articole pe luni</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tricouri" fill="#4C8EDD" />
                <Bar dataKey="bluze" fill="#F5E9D9" />
                <Bar dataKey="pantaloni" fill="#333333" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Frecvența utilizării pe săptămâni</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tricouri" stroke="#4C8EDD" />
                <Line type="monotone" dataKey="bluze" stroke="#F5E9D9" strokeWidth={2} />
                <Line type="monotone" dataKey="pantaloni" stroke="#333333" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Statistici;
