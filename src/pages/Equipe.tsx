import { useState, useCallback } from "react";
import { equipeData, csvSimulatedNames, distribuicaoSaude } from "@/data/mockData";
import { GlassCard } from "@/components/GlassCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Upload, FileUp, Users } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Gestão de Equipe</h1>
          <p className="text-sm text-muted-foreground">{membros.length} colaboradores cadastrados</p>
        </div>
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
                <TableRow key={m.id} className="hover:bg-white/5 transition-colors">
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
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1"><Users className="w-4 h-4" /> {filtered.length} de {membros.length} colaboradores</p>
        </div>
      </GlassCard>
    </div>
  );
}
