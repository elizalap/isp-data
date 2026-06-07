import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/lib/api";

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthCtx = {
  loading: boolean;
  session: string | null; // token JWT
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se há token salvo e valida com a API
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    setSession(token);
    api
      .get("/me") // endpoint Laravel que retorna o usuário autenticado
      .then((r) => setUser(r.data))
      .catch(() => {
        // Token inválido ou expirado
        localStorage.removeItem("token");
        setSession(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // TODO: substituir pelo fluxo OAuth real do Laravel (Socialite + Google)
  // Por enquanto redireciona para a rota de login social do backend
  const signInWithGoogle = async () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/redirect`;
  };

  const signOut = async () => {
    try {
      await api.post("/logout");
    } finally {
      localStorage.removeItem("token");
      setSession(null);
      setUser(null);
    }
  };

  return (
    <Ctx.Provider value={{ loading, session, user, signInWithGoogle, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
