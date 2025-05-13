import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, User, Mail, Lock, Camera, UserRound } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Settings: React.FC = () => {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [gender, setGender] = useState<"barbat" | "femeie" | "neutru">("neutru");

  useEffect(() => {
    // Încarcă datele din localStorage (sau aici ai putea apela backend-ul ca să le aduci)
    const savedName = localStorage.getItem("userName");
    const savedEmail = localStorage.getItem("userEmail");
    const savedGender = localStorage.getItem("userGender") as
      | "barbat"
      | "femeie"
      | "neutru"
      | null;
    const savedImage = localStorage.getItem("userImage");

    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedGender) setGender(savedGender);
    if (savedImage) setProfileImage(savedImage);
  }, []);

  const handleNameUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userName", name);
    toast({ title: "Nume actualizat", description: "Numele a fost actualizat." });
  };

  const handleEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userEmail", email);
    toast({ title: "Email actualizat", description: "Emailul a fost actualizat." });
  };

  const handleGenderUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userGender", gender);
    toast({ title: "Gen actualizat", description: "Genul a fost actualizat." });
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Parolă actualizată", description: "Parola a fost actualizată." });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setProfileImage(dataUrl);
      localStorage.setItem("userImage", dataUrl);
      toast({ title: "Imagine actualizată", description: "Profilul a fost actualizat." });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Setări Cont</h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Imagine profil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} /> Imagine Profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-24 h-24">
                  {profileImage ? (
                    <AvatarImage src={profileImage} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {name.charAt(0) || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>

                <Label htmlFor="picture" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-primary">
                    <Camera size={18} /> Încarcă o imagine
                  </div>
                  <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Schimbă numele */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pencil size={20} /> Schimbă Numele
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNameUpdate} className="space-y-4">
                <Label htmlFor="name">Nume și prenume</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <Button type="submit">Salvează</Button>
              </form>
            </CardContent>
          </Card>

          {/* Schimbă email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail size={20} /> Schimbă Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailUpdate} className="space-y-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <Button type="submit">Salvează</Button>
              </form>
            </CardContent>
          </Card>

          {/* Schimbă gen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound size={20} /> Schimbă Genul
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenderUpdate} className="space-y-4">
                <RadioGroup
                  value={gender}
                  onValueChange={val => setGender(val as any)}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="barbat" id="gender-barbat" />
                    <Label htmlFor="gender-barbat">Bărbat</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="femeie" id="gender-femeie" />
                    <Label htmlFor="gender-femeie">Femeie</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neutru" id="gender-neutru" />
                    <Label htmlFor="gender-neutru">Neutru</Label>
                  </div>
                </RadioGroup>
                <Button type="submit">Salvează</Button>
              </form>
            </CardContent>
          </Card>

          {/* Schimbă parola */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock size={20} /> Schimbă Parola
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <Label htmlFor="currentPassword">Parola curentă</Label>
                <Input id="currentPassword" type="password" required />
                <Label htmlFor="newPassword">Parola nouă</Label>
                <Input id="newPassword" type="password" required />
                <Label htmlFor="confirmPassword">Confirmă parola</Label>
                <Input id="confirmPassword" type="password" required />
                <Button type="submit">Salvează</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
