import { useState, useCallback, useMemo } from "react";
import { equipeData, csvSimulatedNames, distribuicaoSaude, usuariosAppIrun } from "@/data/mockData";
import { GlassCard } from "@/components/GlassCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Upload, FileUp, Users, UserPlus, Check, Plus } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const pieGradients = [
  { id: "gradPie0", from: "#1a3a8f", to: "#3b82f6" },
  { id: "gradPie1", from: "#daa520", to: "#f5d76e" },
  { id: "gradPie2", from: "#0b2297", to: "#1a3a8f" },
  { id: "gradPie3", from: "#c4952a", to: "#daa520" },
  { id: "gradPie4", from: "#2563eb", to: "#60a5fa" },
];

export default function Equipe() {
  const [search, setSearch] = useState("");
  const [membros, setMembros] = useState(equipeData);
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [buscaApp, setBuscaApp] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const filtered = membros.filter((m) => {
    return m.nome.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
  });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const newId = membros.length + 1;
    const newMembers = csvSimulatedNames.map((m, i) => ({ ...m, id: newId + i }));
    setMembros((prev) => [...prev, ...newMembers]);
    setUploaded(true);
  }, [membros.length]);

  const emailsNaEquipe = useMemo(
    () => new Set(membros.map((m) => m.email.toLowerCase())),
    [membros],
  );

  const resultadosBusca = useMemo(() => {
    const q = buscaApp.trim().toLowerCase();
    if (q.length < 2) return [];
    return usuariosAppIrun.filter(
      (u) =>
        u.nome.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q),
    );
  }, [buscaApp]);

  const handleAdicionarUsuario = (usuario: typeof usuariosAppIrun[number]) => {
    setMembros((prev) => [
      ...prev,
      {
        id: prev.length + 1000,
        nome: usuario.nome,
        email: usuario.email,
        distanciaKm: usuario.distanciaKm,
        calorias: usuario.calorias,
        tempoAtividadeMin: usuario.tempoAtividadeMin,
        pontos: usuario.pontos,
      },
    ]);
    toast.success(`${usuario.nome} adicionado à equipe`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Gestão de Equipe</h1>
          <p className="text-sm text-muted-foreground">{membros.length} colaboradores cadastrados</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="font-semibold w-full sm:w-auto">
                <UserPlus className="w-4 h-4 mr-2" /> Buscar no app
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Adicionar colaborador</DialogTitle>
                <DialogDescription>
                  Busque por nome, email ou usuário na base de usuários do app iRun.
                </DialogDescription>
              </DialogHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="Digite ao menos 2 caracteres..."
                  value={buscaApp}
                  onChange={(e) => setBuscaApp(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="max-h-[55vh] overflow-y-auto -mx-6 px-6">
                {buscaApp.trim().length < 2 ? (
                  <div className="text-center py-10 text-sm text-muted-foreground">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    Digite ao menos 2 caracteres para buscar usuários do app.
                  </div>
                ) : resultadosBusca.length === 0 ? (
                  <div className="text-center py-10 text-sm text-muted-foreground">
                    Nenhum usuário encontrado para "{buscaApp}".
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground mb-2">
                      {resultadosBusca.length} resultado{resultadosBusca.length > 1 ? "s" : ""}
                    </p>
                    <ul className="space-y-2">
                      {resultadosBusca.map((u) => {
                        const jaNaEquipe = emailsNaEquipe.has(u.email.toLowerCase());
                        const inicial = u.nome.charAt(0).toUpperCase();
                        return (
                          <li
                            key={u.id}
                            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center shrink-0">
                              {inicial}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{u.nome}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {u.email} · @{u.username}
                              </p>
                            </div>
                            {jaNaEquipe ? (
                              <Badge variant="secondary" className="gap-1 shrink-0">
                                <Check className="w-3 h-3" /> Já na equipe
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleAdicionarUsuario(u)}
                                className="shrink-0 gold-gradient text-primary-foreground hover:opacity-90"
                              >
                                <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar
                              </Button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>

              <div className="flex justify-end pt-2 border-t border-border">
                <Button variant="ghost" onClick={() => setSearchOpen(false)}>
                  Concluir
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-primary-foreground font-semibold hover:opacity-90 w-full sm:w-auto">
                <Upload className="w-4 h-4 mr-2" /> Importar CSV
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Importar Colaboradores</DialogTitle>
            </DialogHeader>
            <div
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-colors ${dragging ? "border-accent bg-accent/5" : "border-border"}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <FileUp className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">Arraste um arquivo .csv aqui</p>
              <p className="text-xs text-muted-foreground">ou</p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={() => {
                  const newId = membros.length + 1;
                  const newMembers = csvSimulatedNames.map((m, i) => ({ ...m, id: newId + i }));
                  setMembros((prev) => [...prev, ...newMembers]);
                  setUploaded(true);
                }}
              >
                Selecionar arquivo
              </Button>
              {uploaded && (
                <p className="text-sm mt-4 font-medium" style={{ color: "hsl(150 60% 45%)" }}>✓ 5 colaboradores importados com sucesso!</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <GlassCard className="animate-fade-in-up">
        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-1">Distribuição de Saúde Corporativa</h2>
        <p className="text-xs text-muted-foreground mb-4">Dados agregados e anônimos — em conformidade com a LGPD</p>
        <div className="h-[220px] sm:h-[260px] overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {pieGradients.map((g) => (
                  <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={g.from} />
                    <stop offset="100%" stopColor={g.to} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={distribuicaoSaude}
                dataKey="valor"
                nameKey="nome"
                cx="50%"
                cy="50%"
                outerRadius={60}
                innerRadius={30}
                paddingAngle={4}
                strokeWidth={0}
                label={({ valor }) => `${valor}%`}
              >
                {distribuicaoSaude.map((_, index) => (
                  <Cell key={index} fill={`url(#${pieGradients[index % pieGradients.length].id})`} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value}%`}
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  color: "#0f172a",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard className="animate-fade-in-up">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="text-right">Dist. (km)</TableHead>
                <TableHead className="text-right hidden md:table-cell">Calorias</TableHead>
                <TableHead className="text-right hidden md:table-cell">Tempo (min)</TableHead>
                <TableHead className="text-right">Pontos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <span>{m.nome}</span>
                    <span className="block sm:hidden text-xs text-muted-foreground">{m.email}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden sm:table-cell">{m.email}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{m.distanciaKm.toFixed(1)}</TableCell>
                  <TableCell className="text-right font-mono text-sm hidden md:table-cell">{m.calorias.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm hidden md:table-cell">{m.tempoAtividadeMin}</TableCell>
                  <TableCell className="text-right font-mono font-semibold text-sm">{m.pontos}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1"><Users className="w-4 h-4" /> {filtered.length} de {membros.length} colaboradores</p>
        </div>
      </GlassCard>
    </div>
  );
}
