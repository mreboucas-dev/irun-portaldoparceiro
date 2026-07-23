// ============================================================================
// Público por cupom — dados AGREGADOS e ANÔNIMOS (LGPD).
// Gera variações determinísticas a partir do id do cupom, para que o mesmo
// cupom sempre exiba a mesma distribuição. Nunca identifica pessoas.
// ============================================================================
import {
  perfilFaixaEtaria,
  perfilTopCidades,
  perfilAtividadePredominante,
  cuponsData,
  type Cupom,
} from "./mockData";

export interface PublicoAgregado {
  escopo: "todos" | number; // id do cupom ou "todos"
  faixaEtaria: { faixa: string; percentual: number }[];
  topCidades: { cidade: string; percentual: number }[];
  atividadePredominante: string;
  amostra: number; // nº aproximado de resgates (base do agregado)
  amostraPequena: boolean;
}

// Hash simples determinístico
function seedFromId(id: number): number {
  let h = 2166136261;
  const s = `cupom-${id}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff;
}

// Reordena/varia percentuais mantendo soma ≈ 100
function variar(
  base: { key: string; percentual: number }[],
  seed: number,
  amplitude = 12,
): { key: string; percentual: number }[] {
  const arr = base.map((b, i) => {
    // deslocamento pseudo-aleatório determinístico por índice
    const s = ((seed * 1000 + i * 137) % 100) / 100;
    const delta = (s - 0.5) * 2 * amplitude;
    return { key: b.key, valor: Math.max(2, b.percentual + delta) };
  });
  const soma = arr.reduce((a, x) => a + x.valor, 0);
  return arr.map((x) => ({
    key: x.key,
    percentual: Math.round((x.valor / soma) * 100),
  }));
}

const nivelPorSeed = (seed: number): string => {
  const escala = perfilAtividadePredominante.escala;
  // enviesa para o meio da escala (pouco provável extremos)
  const centrado = 1 + Math.floor(seed * (escala.length - 2));
  return escala[Math.min(escala.length - 1, Math.max(0, centrado))];
};

export function publicoDoCupom(cupom: Cupom): PublicoAgregado {
  const seed = seedFromId(cupom.id);

  const faixasBase = perfilFaixaEtaria.map((f) => ({
    key: f.faixa,
    percentual: f.percentual,
  }));
  const cidadesBase = perfilTopCidades.map((c) => ({
    key: c.cidade,
    percentual: c.percentual,
  }));

  const faixaEtaria = variar(faixasBase, seed, 14).map((x) => ({
    faixa: x.key,
    percentual: x.percentual,
  }));

  const cidadesVar = variar(cidadesBase, seed + 0.37, 10)
    .map((x) => ({ cidade: x.key, percentual: x.percentual }))
    .sort((a, b) => b.percentual - a.percentual);

  return {
    escopo: cupom.id,
    faixaEtaria,
    topCidades: cidadesVar,
    atividadePredominante: nivelPorSeed(seed),
    amostra: cupom.resgates,
    amostraPequena: cupom.resgates < 100,
  };
}

export function publicoTodos(): PublicoAgregado {
  const amostra = cuponsData.reduce((a, c) => a + c.resgates, 0);
  return {
    escopo: "todos",
    faixaEtaria: perfilFaixaEtaria.map((f) => ({ ...f })),
    topCidades: perfilTopCidades.map((c) => ({ ...c })),
    atividadePredominante: perfilAtividadePredominante.predominante,
    amostra,
    amostraPequena: amostra < 100,
  };
}
