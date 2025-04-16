
import Layout from "@/components/Layout";
import PlannerEvent from "@/components/PlannerEvent";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";

const Planner = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const events = [
    { day: 26, month: "Aprilie", type: "BUSINESS", description: "Ocumal întrimire" },
    { day: 27, month: "Aprilie", type: "TRAVEL", description: "La Paris" },
    { day: 3, month: "Mai", type: "BUSINESS", description: "Prezentare client" },
    { day: 10, month: "Mai", type: "CASUAL", description: "Ieșire cu prietenii" },
    { day: 15, month: "Mai", type: "FORMAL", description: "Cină aniversară" },
  ];

  return (
    <Layout>
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-wardrobe-blue p-3 rounded-full">
          <CalendarIcon size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold">Planner</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            
            <div className="mt-6 flex justify-center">
              <Button className="w-full bg-wardrobe-blue hover:bg-wardrobe-blue/90">
                <Plus size={18} className="mr-2" />
                Adaugă eveniment
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Evenimente viitoare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg overflow-hidden divide-y">
              {events.map((event, idx) => (
                <PlannerEvent 
                  key={idx}
                  day={event.day}
                  type={event.type}
                  description={event.description}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-bold mt-8 mb-4">Ținute planificate</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-md">{i === 1 ? "26 Apr - BUSINESS" : i === 2 ? "27 Apr - TRAVEL" : "3 Mai - BUSINESS"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="bg-gray-100 p-2 rounded-md flex-1">
                    <img src="/placeholder.svg" alt="Outfit item" className="h-20 object-contain mx-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default Planner;
