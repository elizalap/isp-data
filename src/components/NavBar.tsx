import { Sun, Moon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import { useNavigate } from "@tanstack/react-router";

const iconBtn: React.CSSProperties = {
  background: "none",
  border: "0.5px solid var(--border-c)",
  borderRadius: 8,
  padding: 6,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--text2)",
};

interface NavbarProps {
  providerCount?: number;
  mode: "dark" | "light";
  toggle: () => void;
}

export function Navbar({ providerCount, mode, toggle }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; avatar: string | null } | null>(
    null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     if (session?.user) {
  //       const meta = session.user.user_metadata;
  //       setUser({
  //         name: meta?.full_name ?? meta?.name ?? session.user.email ?? "",
  //         email: session.user.email ?? "",
  //         avatar: meta?.avatar_url ?? meta?.picture ?? null,
  //       });
  //     }
  //   });
  // }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // const handleSignOut = async () => {
  //   await supabase.auth.signOut();
  //   navigate({ to: "/login" });
  // };

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <nav
      style={{
        background: "var(--bg2)",
        borderBottom: "1px solid var(--border-c)",
        padding: "0 24px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Brand */}
      <div
        style={{
          fontFamily: "var(--font-head)",
          fontWeight: 800,
          fontSize: 16,
          letterSpacing: "0.04em",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--blue)" }} />
        SUPERCOMM
        <span style={{ color: "var(--text3)", fontWeight: 400, fontSize: 13, marginLeft: 6 }}>
          / Inteligência de Mercado ISP
        </span>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 12, color: "var(--text3)" }}>
          {providerCount != null
            ? `${providerCount.toLocaleString("pt-BR")} provedores na base`
            : "Carregando..."}
        </span>

        <button onClick={toggle} title="Alternar tema" style={iconBtn} aria-label="Alternar tema">
          {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User menu */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => setOpen((v) => !v)}
            style={{
              background: "none",
              border: "0.5px solid var(--border-c)",
              borderRadius: 999,
              padding: "4px 10px 4px 4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            aria-label="Menu do usuário"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                {initials}
              </div>
            )}
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text1)",
                maxWidth: 140,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.name ?? "..."}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              style={{ color: "var(--text3)", flexShrink: 0 }}
            >
              <path
                d="M2 4l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {open && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                background: "var(--bg2)",
                border: "0.5px solid var(--border-c)",
                borderRadius: 12,
                minWidth: 200,
                zIndex: 200,
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "12px 16px", borderBottom: "0.5px solid var(--border-c)" }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text1)" }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
                  {user?.email}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#E24B4A",
                  textAlign: "left",
                }}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
