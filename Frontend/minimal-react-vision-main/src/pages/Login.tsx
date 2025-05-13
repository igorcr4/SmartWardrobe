// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JWTPayload {
  sub: string;   // id-ul utilizatorului (string în JWT)
  exp: number;
  iat: number;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/auth/login",
        { email, password }
      );

      const token: string = data.token;
      localStorage.setItem("token", token);

      // ─── Decode & validate ───
      const decoded = jwtDecode<JWTPayload>(token);
      if (!decoded.sub) {
        throw new Error("Token invalid – lipsește sub (userId)");
      }
      localStorage.setItem("userId", decoded.sub); // salvează id-ul

      toast({
        title: "Autentificare reușită",
        description: "Bine ai revenit!",
      });

      // redirect fără refresh, compatibil cu react-router-dom v6
      navigate("/recomandari", { replace: true });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Eroare la autentificare",
        description:
          err.response?.data?.message ??
          err.message ??
          "Nu s-a putut realiza login-ul",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Bine ai venit</CardTitle>
          <p className="text-sm text-gray-500">
            Intră în contul tău pentru a continua
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              <LogIn className="mr-2 h-4 w-4" />
              {isLoading ? "Se încarcă…" : "Conectare"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span>Nu ai un cont? </span>
            <Link to="/register" className="text-primary hover:underline">
              Înregistrează-te
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
