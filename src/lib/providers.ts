export type Provider = {
  cnpj: string | null;
  nome: string | null;
  fantasia: string | null;
  celeti: boolean;
  hub: boolean;
  cdn: boolean;
  rami: boolean;
  asn: string | number | null;
  erp: string | null;
  assinantes: number | null;
  uf: string | null;
  municipio: string | null;
  porte: string | null;
  situacao: string | null;
  abertura: string | null;
  capital: number | null;
  cnae: string | null;
  socio: string | null;
  tel: string | null;
  email: string | null;
  email_status: string | null;
  tel2: string | null;
  tel3: string | null;
  tel4: string | null;
  tel5: string | null;
  faixa: string | null;
  // Conectividade / PTTs
  conectado_ixbr: boolean | null;
  ptts_ixbr: string | null;
  qtd_ptts_ixbr: number | null;
  ptts_peeringdb: string | null;
  qtd_ptts_peeringdb: number | null;
  ptts_cidades_peeringdb: string | null;
  ptts_paises_peeringdb: string | null;
  velocidade_portas: string | null;
  politica_peering: string | null;
  ptts_consolidados: string | null;
  qtd_ptts_total: number | null;
  ptt_proximo: string | null;
  distancia_km: number | null;
  score: string | null;
};

// Buckets fixos vindos da base (Anatel) — representam ponto médio das faixas
export const ASSINANTES_BUCKETS: { value: string; label: string; match: (a: number) => boolean }[] = [
  { value: "5k", label: "Até 5 mil", match: a => a > 0 && a < 5000 },
  { value: "5-20k", label: "5–20 mil", match: a => a >= 5000 && a < 20000 },
  { value: "20-50k", label: "20–50 mil", match: a => a >= 20000 && a < 50000 },
  { value: "50-100k", label: "50–100 mil", match: a => a >= 50000 && a < 100000 },
  { value: "100k+", label: "Mais de 100 mil", match: a => a >= 100000 },
];

import { supabase } from "@/integrations/supabase/client";

let cache: Provider[] | null = null;

const PAGE = 1000;

export async function loadProviders(): Promise<Provider[]> {
  if (cache) return cache;
  const all: Provider[] = [];
  let from = 0;
  // Paginação para superar o limite padrão de 1000 linhas do PostgREST
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await supabase
      .from("base_isp_final")
      .select("*")
      .range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;
    all.push(...(data as unknown as Provider[]));
    if (data.length < PAGE) break;
    from += PAGE;
  }
  cache = all;
  return cache;
}

export function formatPhone(v: string | null | undefined): string | null {
  if (!v) return null;
  const s = String(v).replace(/\D/g, "").replace(/\.0$/, "");
  if (!s) return null;
  if (s.length === 11) return `(${s.slice(0, 2)}) ${s.slice(2, 7)}-${s.slice(7)}`;
  if (s.length === 10) return `(${s.slice(0, 2)}) ${s.slice(2, 6)}-${s.slice(6)}`;
  return s;
}

export function formatCNPJ(v: string | null | undefined): string {
  if (!v) return "—";
  const s = String(v).padStart(14, "0");
  return `${s.slice(0, 2)}.${s.slice(2, 5)}.${s.slice(5, 8)}/${s.slice(8, 12)}-${s.slice(12)}`;
}

export function formatBRL(n: number | null | undefined): string {
  if (n == null) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}
