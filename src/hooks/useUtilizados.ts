import { useCallback, useEffect, useState } from "react";
import { cuponsData } from "@/data/mockData";

const STORAGE_KEY = "portal-parceiro:utilizados";

type UtilizadosMap = Record<number, number>;

function readStore(): UtilizadosMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(map: UtilizadosMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

/**
 * Hook para ler/escrever "utilizados" por cupom, com persistência em localStorage.
 * Retorna um mapa com os valores efetivos (override do localStorage OU o mock inicial).
 */
export function useUtilizados() {
  const [overrides, setOverrides] = useState<UtilizadosMap>(() => readStore());

  useEffect(() => {
    writeStore(overrides);
  }, [overrides]);

  const getUtilizados = useCallback(
    (id: number): number => {
      if (id in overrides) return overrides[id];
      const cupom = cuponsData.find((c) => c.id === id);
      return cupom?.utilizados ?? 0;
    },
    [overrides]
  );

  const setUtilizados = useCallback((id: number, value: number) => {
    const safe = Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));
    setOverrides((prev) => ({ ...prev, [id]: safe }));
  }, []);

  return { getUtilizados, setUtilizados };
}
