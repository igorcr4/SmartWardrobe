// src/pages/Recomandari.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Plus,
  Save,
  Shirt,
  Trash2,
  ImagePlus,
  Sun,
  Moon,
  CloudSnow,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

// utilitare temperatură + iconițe
import {
  getOutfitAvgTemp,
  getWeatherIcon,
} from "@/components/Temperature";

/* ------------------------------------------------------------------ */
/* ----------------------------- TIPURI ------------------------------*/
/* ------------------------------------------------------------------ */

interface ClothingItem {
  id: number;
  name: string;
  type: string;
  imageUrl: string | null;
}

interface OutfitDto {
  id: number;
  name: string;
  timestamp: string;
  garments: ClothingItem[];
}

interface MLResponse {
  temp: number;
  condition: string;
  outfit: string[];
}

/* ------------------------------------------------------------------ */
/* -------------------- AXIOS + INTERCEPTOR --------------------------*/
/* ------------------------------------------------------------------ */

const API = axios.create({ baseURL: "http://localhost:8080/api" });
API.interceptors.request.use((cfg) => {
  const tok = localStorage.getItem("token");
  if (tok) cfg.headers.Authorization = `Bearer ${tok}`;
  return cfg;
});

/* ------------------------------------------------------------------ */
/* ------------------------- COMPONENT -------------------------------*/
/* ------------------------------------------------------------------ */

const Recomandari: React.FC = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const navigate = useNavigate();

  /* --------------- STATE & GEOLOCALIZARE ------------------------- */
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const tok = localStorage.getItem("token");
    const uid = localStorage.getItem("userId");
    if (!(tok && uid)) {
      navigate("/login");
      return;
    }
    setUserId(uid);

    navigator.geolocation.getCurrentPosition(
      (p) => setCoords({ lat: p.coords.latitude, lon: p.coords.longitude }),
      (err) => console.error("Eroare geoloc:", err)
    );
  }, [navigate]);

  /* ------------------ RECOMANDARE ML ----------------------------- */
  const {
    data: recData,
    isPending: recPending,
    error: recError,
  } = useQuery<MLResponse, Error>({
    queryKey: ["recommend", coords, userId],
    enabled: !!coords && !!userId,
    staleTime: 1000 * 60 * 5,
    queryFn: () =>
      axios
        .post<MLResponse>("http://localhost:5002/recommend", {
          user_id: Number(userId),
          lat: coords!.lat,
          lon: coords!.lon,
        })
        .then((r) => r.data),
  });

  /* ------------------ LISTA ARTICOLE ----------------------------- */
  const {
    data: garments = [],
    isPending: garmentsPending,
    error: garmentsError,
  } = useQuery<ClothingItem[]>({
    queryKey: ["garments", userId],
    enabled: !!userId,
    queryFn: () => API.get<ClothingItem[]>("/garments").then((r) => r.data),
  });

  const addGarment = useMutation({
    mutationFn: (fd: FormData) =>
      API.post<ClothingItem>("/garments", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: (resp) => {
      qc.setQueryData(["garments", userId], (old: any) =>
        old ? [...old, resp.data] : [resp.data]
      );
      toast({ title: "Articol adăugat!" });
    },
    onError: () =>
      toast({
        title: "Eroare",
        description: "Nu am putut adăuga articolul.",
        variant: "destructive",
      }),
  });

  const deleteGarment = useMutation({
    mutationFn: (id: number) => API.delete(`/garments/${id}`),
    onSuccess: (_, id) => {
      qc.setQueryData(["garments", userId], (old: any) =>
        old ? old.filter((x: ClothingItem) => x.id !== id) : []
      );
      setCurrentOutfit((prev) => prev.filter((x) => x.id !== id));
      toast({ title: "Articol șters!" });
    },
  });

  /* ----------------------- OUTFITURI ------------------------------ */
  const [currentOutfit, setCurrentOutfit] = useState<ClothingItem[]>([]);
  const [outfitName, setOutfitName] = useState("");

  const saveOutfit = useMutation({
    mutationFn: (data: { ids: number[]; name: string }) =>
      API.post(
        "/outfit",
        null,
        {
          params: {
            garmentId: data.ids,
            email: localStorage.getItem("userEmail"),
            name:
              data.name ||
              "Ținută salvată " + new Date().toLocaleDateString(),
          },
          paramsSerializer: { indexes: null },
        }
      ),
    onSuccess: () => {
      setCurrentOutfit([]);
      setOutfitName("");
      toast({ title: "Ținută salvată!" });
      qc.invalidateQueries(["outfits", userId]);
    },
    onError: () =>
      toast({ title: "Eroare la salvare", variant: "destructive" }),
  });

  const {
    data: outfits = [],
    isPending: outfitsPending,
    error: outfitsError,
  } = useQuery<OutfitDto[]>({
    queryKey: ["outfits", userId],
    enabled: !!userId,
    queryFn: () => API.get<OutfitDto[]>("/outfit").then((r) => r.data),
  });

const deleteOutfit = useMutation({
  mutationFn: (id: number) => API.delete(`/outfit/${id}`),
  onSuccess: () => {
    toast({ title: "Ținută ștearsă!" });
    qc.invalidateQueries(["outfits", userId]);
  },
  onError: () =>
    toast({
      title: "Eroare la ștergere",
      description: "Nu s-a putut șterge ținuta",
      variant: "destructive",
    }),
});

  const removeGarmentFromOutfit = useMutation({
    mutationFn: ({
      outfitId,
      garmentId,
    }: {
      outfitId: number;
      garmentId: number;
    }) => API.delete(`/outfit/${outfitId}/garments/${garmentId}`),
    onSuccess: (_, { outfitId, garmentId }) => {
      qc.setQueryData(
        ["outfits", userId],
        (old: OutfitDto[] | undefined) =>
          old?.map((o) =>
            o.id === outfitId
              ? {
                  ...o,
                  garments: o.garments.filter((g) => g.id !== garmentId),
                }
              : o
          ) || []
      );
      toast({ title: "Articol eliminat!" });
    },
  });

  /* -------------- PREVIEW + INPUT IMAGE --------------------------- */
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState("Geacă");
  const [newItemFile, setNewItemFile] = useState<File | null>(null);
  const [newItemPreview, setNewItemPreview] = useState<string | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setNewItemFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setNewItemPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleAdd = () => {
    if (!newItemName.trim()) {
      toast({ title: "Completează numele!", variant: "destructive" });
      return;
    }
    const fd = new FormData();
    fd.append("name", newItemName);
    fd.append("type", newItemType);
    if (newItemFile) fd.append("file", newItemFile);
    addGarment.mutate(fd, {
      onSuccess: () => {
        setNewItemName("");
        setNewItemType("Geacă");
        setNewItemFile(null);
        setNewItemPreview(null);
      },
    });
  };

  /* ---------------------- DRAG & DROP ----------------------------- */
  const onDragStart = (e: React.DragEvent, it: ClothingItem) =>
    e.dataTransfer.setData("item", JSON.stringify(it));

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const it = JSON.parse(e.dataTransfer.getData("item")) as ClothingItem;
    setCurrentOutfit((prev) =>
      prev.find((x) => x.id === it.id) ? prev : [...prev, it]
    );
  };

  /* ---------------------------- UI -------------------------------- */
  return (
    <Layout>
      {/* ---------------- HEADER ---------------- */}
      <div className="mb-8 flex items-center gap-4">
        <div className="bg-wardrobe-blue p-3 rounded-full">
          <User size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold">Recomandări personalizate</h1>
      </div>

      {/* ȚINUTA RECOMANDATĂ DE ML */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Ținuta recomandată azi</CardTitle>
        </CardHeader>
        <CardContent>
          {recPending && <p>Se încarcă recomandarea…</p>}
          {recError && (
            <p className="text-red-500">Eroare la încărcare.</p>
          )}
          {recData && (
            <>
              <p className="mb-2">
                🌡️ {Math.round(recData.temp)}°C — {recData.condition}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {recData.outfit.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>

      {/* ---------------- CREARE ȚINUTĂ ---------------- */}
      <Card className="mb-8">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Creare ținută</CardTitle>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Nume ținută"
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              className="w-48"
            />
            <Button
              size="sm"
              disabled={
                currentOutfit.length === 0 || saveOutfit.isPending
              }
              onClick={() =>
                saveOutfit.mutate({
                  ids: currentOutfit.map((g) => g.id),
                  name: outfitName,
                })
              }
            >
              <Save size={16} className="mr-1" />
              Salvează
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            {/* -------------- LISTA ARTICOLE -------------- */}
            <div className="md:w-1/2">
              <h3 className="mb-4 font-medium">Garderoba ta</h3>

              {/* FORM ADD */}
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Nume articol"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <select
                  value={newItemType}
                  onChange={(e) => setNewItemType(e.target.value)}
                  className="px-3 py-2 border rounded text-sm"
                >
                  <option value="Geacă">Geacă</option>
                  <option value="Jachetă">Jachetă</option>
                  <option value="Pulover">Pulover</option>
                  <option value="Jerseu">Jerseu</option>
                  <option value="Tricou">Tricou</option>
                  <option value="Camașă">Camașă</option>
                  <option value="Pantaloni">Pantaloni</option>
                  <option value="Pantaloni scurți">Pantaloni scurți</option>
                  <option value="Rochie">Rochie</option>
                  <option value="Fustă">Fustă</option>
                  <option value="Blugi">Blugi</option>
                  <option value="Adidași">Adidași</option>
                  <option value="Pantofi">Pantofi</option>
                  <option value="Cizme">Cizme</option>
                  <option value="Accesorii">Accesorii</option>
                </select>

                {/* IMAGE PICKER */}
                <div className="relative">
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImage}
                  />
                  <Label
                    htmlFor="file"
                    className="cursor-pointer flex items-center justify-center h-10 w-10 bg-primary text-primary-foreground rounded-md"
                  >
                    <ImagePlus size={18} />
                  </Label>
                  {newItemPreview && (
                    <div className="absolute -right-2 -top-2">
                      <button
                        onClick={() => {
                          setNewItemPreview(null);
                          setNewItemFile(null);
                        }}
                        className="p-1 bg-red-500 text-white rounded-full"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <Button
                  size="sm"
                  onClick={handleAdd}
                  disabled={addGarment.isPending}
                >
                  <Plus size={16} className="mr-1" />
                  Adaugă
                </Button>
              </div>

              {newItemPreview && (
                <div className="mb-4 flex items-center gap-4">
                  <img
                    src={newItemPreview}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded"
                  />
                  <p>Previzualizare</p>
                </div>
              )}

              {/* LISTĂ ARTICOLE */}
              {garmentsPending && <p>Se încarcă articolele…</p>}
              {garmentsError && (
                <p className="text-red-500">Eroare la încărcare.</p>
              )}
              {!garmentsPending && garments.length === 0 && (
                <p>Nu ai adăugat articole.</p>
              )}
              {garments.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {garments.map((it) => (
                    <div
                      key={it.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, it)}
                      className="relative flex flex-col items-center bg-gray-100 p-2 rounded cursor-move group"
                    >
                      {it.imageUrl ? (
                        <img
                          src={`http://localhost:8080${it.imageUrl}`}
                          alt={it.name}
                          className="w-full h-24 object-cover rounded mb-2"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).src =
                              "/placeholder.svg")
                          }
                        />
                      ) : (
                        <div className="w-full h-24 flex items-center justify-center bg-gray-200 rounded mb-2">
                          <Shirt size={32} className="text-gray-400" />
                        </div>
                      )}
                      <p className="text-sm font-medium">{it.name}</p>
                      <p className="text-xs text-gray-500">{it.type}</p>
                      <button
                        onClick={() => deleteGarment.mutate(it.id)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* -------------- ZONA CREARE ---------------- */}
            <div className="md:w-1/2">
              <h3 className="mb-4 font-medium">Zonă de creare</h3>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="bg-gray-100 p-8 rounded-lg min-h-96 border-2 border-dashed border-gray-300"
              >
                {currentOutfit.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Shirt size={48} />
                    <p className="mt-2">Trage articole aici</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {currentOutfit.map((it) => (
                      <div
                        key={it.id}
                        className="relative flex flex-col items-center bg-white p-2 rounded shadow"
                      >
                        {it.imageUrl ? (
                          <img
                            src={`http://localhost:8080${it.imageUrl}`}
                            alt={it.name}
                            className="w-full h-24 object-cover rounded mb-2"
                            onError={(e) =>
                              ((e.target as HTMLImageElement).src =
                                "/placeholder.svg")
                            }
                          />
                        ) : (
                          <div className="w-full h-24 flex items-center justify-center bg-gray-200 rounded mb-2">
                            <Shirt size={32} className="text-gray-400" />
                          </div>
                        )}
                        <p className="text-sm font-medium">{it.name}</p>
                        <button
                          onClick={() =>
                            setCurrentOutfit((prev) =>
                              prev.filter((x) => x.id !== it.id)
                            )
                          }
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------------- LISTA ȚINUTE SALVATE ---------------- */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Ținutele mele salvate</CardTitle>
        </CardHeader>
        <CardContent>
          {outfitsPending && <p>Se încarcă ținutele…</p>}
          {outfitsError && (
            <p className="text-red-500">Eroare la încărcare.</p>
          )}
          {!outfitsPending && outfits.length === 0 && (
            <p>Nu ai salvat încă nicio ținută.</p>
          )}

          {outfits.map((of) => {
              const summerTypes = new Set([
                      "pantaloni scurți",
                      "tricou",
                      "rochie",
                      "fustă",
                      "adidași",
                      "blugi"
                    ]);
                    const winterTypes = new Set([
                      "geacă",
                      "jachetă",
                      "pulover",
                      "cizme",
                      "pantofi"
                    ]);
      let SeasonIcon;
      if (of.garments.some(g => summerTypes.has(g.type.toLowerCase()))) {
        SeasonIcon = <Sun size={16} className="text-yellow-500" />;
      } else if (of.garments.some(g => winterTypes.has(g.type.toLowerCase()))) {
        SeasonIcon = <CloudSnow size={16} className="text-blue-500" />;
      } else {
        SeasonIcon = <Moon size={16} className="text-gray-700" />;
      }
            return (
              <div key={of.id} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {SeasonIcon}
                  <h4 className="font-semibold">{of.name}</h4>
                </div>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteOutfit.mutate(of.id)}
                    disabled={deleteOutfit.isLoading}
                  >
                    <Trash2 size={14} className="mr-1" />
                    Șterge
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {of.garments.map((g) => (
                    <div
                      key={g.id}
                      className="relative flex flex-col items-center bg-gray-100 p-2 rounded"
                    >
                      <img
                        src={`http://localhost:8080${g.imageUrl}`}
                        alt={g.name}
                        className="w-full h-24 object-cover rounded mb-1"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src =
                            "/placeholder.svg")
                        }
                      />
                      <div className="text-xs text-center">
                        <div className="font-medium">{g.name}</div>
                        <div className="text-gray-500">{g.type}</div>
                      </div>
                      <button
                        onClick={() =>
                          removeGarmentFromOutfit.mutate({
                            outfitId: of.id,
                            garmentId: g.id,
                          })
                        }
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Recomandari;
