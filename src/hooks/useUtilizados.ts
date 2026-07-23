import { useCallback, useEffect, useState } from "react";
import { cuponsData } from "@/data/mockData";

const STORAGE_KEY = "portal-parceiro:utilizados";
export const UTILIZADOS_LAST_UPDATE_KEY = "portal-parceiro:utilizados:last-update";

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
    setOverrides((prev) => {
      if (prev[id] === safe) return prev;
      try {
        localStorage.setItem(UTILIZADOS_LAST_UPDATE_KEY, new Date().toISOString());
        window.dispatchEvent(new Event("portal-parceiro:utilizados-updated"));
      } catch {
        /* ignore */
      }
      return { ...prev, [id]: safe };
    });
  }, []);

  return { getUtilizados, setUtilizados };
}

/**
 * Retorna a data da última atualização manual do campo "utilizados" (ou null).
 * Reativo ao evento disparado por setUtilizados.
 */
export function useUtilizadosLastUpdate(): Date | null {
  const read = (): Date | null => {
    try {
      const raw = localStorage.getItem(UTILIZADOS_LAST_UPDATE_KEY);
      if (!raw) return null;
      const d = new Date(raw);
      return Number.isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  };
  const [date, setDate] = useState<Date | null>(() => read());
  useEffect(() => {
    const handler = () => setDate(read());
    window.addEventListener("portal-parceiro:utilizados-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("portal-parceiro:utilizados-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return date;
}
