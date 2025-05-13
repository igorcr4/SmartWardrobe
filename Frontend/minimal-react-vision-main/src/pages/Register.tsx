import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"barbat"|"femeie"|"neutru">("neutru");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1) Construieşte payload-ul
      const payload = {
        username: name,
        email,
        password,
        gender: gender.toUpperCase(), // "BARBAT" | "FEMEIE" | "NEUTRU"
      };

      // 2) Apelează backend-ul
      const response = await axios.post("http://localhost:8080/api/auth/register", payload);

      // 3) Salvează în localStorage pentru Settings
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userGender", gender);

      // 4) Redirecţionează la login
      navigate("/login");
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert("Eroare la înregistrare!");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Creează un cont</CardTitle>
          <p className="text-sm text-gray-500">
            Înregistrează-te pentru a accesa toate funcționalitățile
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nume */}
            <div className="space-y-2">
              <Label htmlFor="name">Nume</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="name"
                  placeholder="Numele tău complet"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nume@exemplu.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Parolă */}
            <div className="space-y-2">
              <Label htmlFor="password">Parolă</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Gen */}
            <div className="space-y-2">
              <Label>Gen</Label>
              <RadioGroup
                value={gender}
                onValueChange={val => setGender(val as any)}
                className="flex space-x-4"
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
            </div>

            <Button type="submit" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Înregistrează-te
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span>Ai deja un cont? </span>
            <Link to="/login" className="text-primary hover:underline">
              Conectează-te
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
