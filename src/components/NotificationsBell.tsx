import { useState } from "react";
import { Bell, AlertTriangle, TrendingUp, Package, Star, FileWarning } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { notificacoesIniciais, type Notificacao, type TipoNotificacao } from "@/data/mockData";
import { cn } from "@/lib/utils";

const iconMap: Record<TipoNotificacao, React.ElementType> = {
  cupom_expirando: AlertTriangle,
  cupom_alto_uso: TrendingUp,
  estoque_baixo: Package,
  nova_avaliacao: Star,
  contrato_vencendo: FileWarning,
};

export function NotificationsBell() {
  const [items, setItems] = useState<Notificacao[]>(notificacoesIniciais);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const naoLidas = items.filter((n) => !n.lida).length;

  const handleClick = (n: Notificacao) => {
    setItems((prev) => prev.map((it) => (it.id === n.id ? { ...it, lida: true } : it)));
    setOpen(false);
    navigate(n.link);
  };

  const marcarTodasComoLidas = () => {
    setItems((prev) => prev.map((it) => ({ ...it, lida: true })));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="relative p-2 rounded-full hover:bg-muted transition-colors"
          aria-label={`Notificações${naoLidas > 0 ? ` (${naoLidas} não lidas)` : ""}`}
        >
          <Bell className="w-5 h-5 text-foreground" />
          {naoLidas > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
              {naoLidas}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="text-lg">Notificações</SheetTitle>
          <SheetDescription>
            {naoLidas > 0 ? `${naoLidas} alertas não lidos` : "Você está em dia"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground text-center">
              Nenhuma notificação no momento.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => {
                const Icon = iconMap[n.tipo];
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => handleClick(n)}
                      className={cn(
                        "w-full text-left p-4 flex gap-3 hover:bg-muted/60 transition-colors",
                        !n.lida && "bg-accent/5"
                      )}
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <p className={cn("text-sm flex-1", !n.lida ? "font-semibold text-foreground" : "text-foreground/80")}>
                            {n.titulo}
                          </p>
                          {!n.lida && <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.descricao}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(n.data).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full"
              onClick={marcarTodasComoLidas}
              disabled={naoLidas === 0}
            >
              Marcar todas como lidas
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
