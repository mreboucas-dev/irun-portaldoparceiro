import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "portal-parceiro:ticket-medio";
const DEFAULT_TICKET = 120;

function readStore(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_TICKET;
    const n = parseFloat(raw);
    return Number.isFinite(n) && n >= 0 ? n : DEFAULT_TICKET;
  } catch {
    return DEFAULT_TICKET;
  }
}

/**
 * Premissa editável de ticket médio (R$), global e persistida em localStorage.
 * É uma estimativa informada pelo parceiro — não é dado medido de venda real.
 */
export function useTicketMedio() {
  const [ticketMedio, setTicketMedioState] = useState<number>(() => readStore());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(ticketMedio));
    } catch {
      /* ignore */
    }
  }, [ticketMedio]);

  const setTicketMedio = useCallback((value: number) => {
    const safe = Math.max(0, Number.isFinite(value) ? value : 0);
    setTicketMedioState(safe);
  }, []);

  return { ticketMedio, setTicketMedio, defaultTicket: DEFAULT_TICKET };
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}
