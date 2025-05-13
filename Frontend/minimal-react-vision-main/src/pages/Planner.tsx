// src/pages/Planner.tsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlannerEventDto {
  id: number;
  date: string;         // ISO date
  title: string;
  description: string;
  outfitId: number | null;
}

interface ClothingItemDto {
  id: number;
  name: string;
  type: string;
  imageUrl: string;
}

interface OutfitDto {
  id: number;
  name: string;
  timestamp: string;
  garments: ClothingItemDto[];
}

interface CreatePlannerEventDto {
  date: string;         // ISO date
  title: string;
  description: string;
}

const API_EVENTS = axios.create({ baseURL: "http://localhost:8080/api/events" });
const API_OUTFITS = axios.create({ baseURL: "http://localhost:8080/api/outfit" });

// Adaugă token-ul în header
[API_EVENTS, API_OUTFITS].forEach(api =>
  api.interceptors.request.use(cfg => {
    const token = localStorage.getItem("token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  })
);

const Planner: React.FC = () => {
  const { toast } = useToast();
  const qc = useQueryClient();

  // --- state pentru Calendar + Dialog creare ---
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // --- state pentru Dialog asociere outfit ---
  const [assignOpen, setAssignOpen] = useState(false);
  const [toAssignEvent, setToAssignEvent] = useState<PlannerEventDto | null>(null);
  const [chosenOutfitId, setChosenOutfitId] = useState<number | null>(null);

  // --- Queries ---
  const {
    data: events = [],
    isLoading: eventsLoading,
    isError: eventsError,
  } = useQuery<PlannerEventDto[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await API_EVENTS.get<PlannerEventDto[]>("");
      return data;
    },
  });

  const {
    data: outfits = [],
    isLoading: outfitsLoading,
    isError: outfitsError,
  } = useQuery<OutfitDto[]>({
    queryKey: ["outfits"],
    queryFn: async () => {
      const { data } = await API_OUTFITS.get<OutfitDto[]>("");
      return data;
    },
  });

  // --- Mutations ---
  const createEvent = useMutation({
    mutationFn: (dto: CreatePlannerEventDto) =>
      API_EVENTS.post("", dto),
    onSuccess: () => {
      qc.invalidateQueries(["events"]);
      setDialogOpen(false);
      setNewTitle("");
      setNewDesc("");
      toast({ title: "Eveniment creat cu succes!" });
    },
    onError: () =>
      toast({ title: "Eroare la creare", variant: "destructive" }),
  });

  const deleteEvent = useMutation({
    mutationFn: (id: number) => API_EVENTS.delete(`/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(["events"]);
      toast({ title: "Eveniment șters!" });
    },
    onError: () =>
      toast({ title: "Eroare la ștergere", variant: "destructive" }),
  });

  const assignOutfit = useMutation({
    mutationFn: ({ eventId, outfitId }: { eventId: number; outfitId: number }) =>
      API_EVENTS.patch(`/${eventId}/outfit/${outfitId}`),
    onSuccess: () => {
      qc.invalidateQueries(["events"]);
      setAssignOpen(false);
      toast({ title: "Ținuta a fost asociată evenimentului!" });
    },
    onError: () =>
      toast({ title: "Eroare la asociere", variant: "destructive" }),
  });

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-wardrobe-blue p-3 rounded-full">
          <CalendarIcon size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold">Planner</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Calendar + Adaugă eveniment */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />

            <div className="mt-6 flex justify-center">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-wardrobe-blue hover:bg-wardrobe-blue/90">
                    <Plus size={18} className="mr-2" />
                    Adaugă eveniment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Adaugă eveniment – {selectedDate.toLocaleDateString()}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Titlu</Label>
                      <Input
                        id="title"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="desc">Descriere</Label>
                      <Input
                        id="desc"
                        value={newDesc}
                        onChange={e => setNewDesc(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        disabled={!newTitle.trim()}
                        onClick={() =>
                          createEvent.mutate({
                            date: selectedDate.toISOString().slice(0, 10),
                            title: newTitle,
                            description: newDesc,
                          })
                        }
                      >
                        Salvează
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Evenimente viitoare */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Evenimente viitoare</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {eventsLoading && <p className="p-4">Se încarcă…</p>}
            {eventsError && (
              <p className="p-4 text-red-500">Eroare la încărcare.</p>
            )}
            {!eventsLoading && !eventsError && (
              <div className="bg-white rounded-lg overflow-hidden divide-y">
                {events.map(evt => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-wardrobe-blue mr-4">
                        {new Date(evt.date).getDate()}
                      </span>
                      <div>
                        <span className="font-semibold text-sm uppercase">
                          {evt.title}
                        </span>
                        <div className="text-sm">{evt.description}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-1"
                        onClick={() => deleteEvent.mutate(evt.id)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-1"
                        onClick={() => {
                          setToAssignEvent(evt);
                          setChosenOutfitId(evt.outfitId);
                          setAssignOpen(true);
                        }}
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog asociere ținută */}
      {toAssignEvent && (
        <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Alege ținuta pentru “
                <span className="text-wardrobe-blue uppercase">
                  {toAssignEvent.title}
                </span>
                ”
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {outfitsLoading && <p>Se încarcă ținutele…</p>}
              {outfitsError && <p className="text-red-500">Eroare la încărcare.</p>}
              {!outfitsLoading &&
                !outfitsError &&
                outfits.map(of => (
                  <label
                    key={of.id}
                    className="flex items-center gap-3 p-2 border rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="outfit"
                      value={of.id}
                      checked={chosenOutfitId === of.id}
                      onChange={() => setChosenOutfitId(of.id)}
                    />
                    <span>{of.name}</span>
                  </label>
                ))}
              <div className="flex justify-end">
                <Button
                  disabled={chosenOutfitId == null}
                  onClick={() =>
                    assignOutfit.mutate({
                      eventId: toAssignEvent.id,
                      outfitId: chosenOutfitId!,
                    })
                  }
                >
                  Salvează ținuta
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Ținute planificate */}
      <h2 className="text-xl font-bold mt-8 mb-4">Ținute planificate</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events
          .filter(e => e.outfitId != null)
          .map(e => {
            const outfit = outfits.find(o => o.id === e.outfitId);
            if (!outfit) return null;
            return (
              <Card key={e.id}>
                <CardHeader>
                  <CardTitle className="text-md">
                    {new Date(e.date).toLocaleDateString()} –{" "}
                    <span className="font-semibold text-wardrobe-blue">
                      {outfit.name}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {outfit.garments.map(g => (
                      <div
                        key={g.id}
                        className="bg-gray-100 p-2 rounded-md flex flex-col items-center"
                      >
                        <img
                          src={`http://localhost:8080${g.imageUrl}`}
                          alt={g.name}
                          className="h-20 object-contain"
                          onError={ev =>
                            ((ev.target as HTMLImageElement).src =
                              "/placeholder.svg")
                          }
                        />
                        <span className="text-xs mt-1">{g.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </Layout>
  );
};

export default Planner;
