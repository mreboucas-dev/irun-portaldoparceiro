import { useState, useCallback } from "react";
import { equipeData, csvSimulatedNames } from "@/data/mockData";
import { GlassCard } from "@/components/GlassCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Upload, FileUp, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const nivelColors: Record<string, string> = {
  Atleta: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Ativo: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Sedentário: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Equipe() {
  const [search, setSearch] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("todos");
  const [membros, setMembros] = useState(equipeData);
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const filtered = membros.filter((m) => {
    const matchSearch = m.nome.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchNivel = filtroNivel === "todos" || m.nivel === filtroNivel;
    return matchSearch && matchNivel;
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Equipe</h1>
          <p className="text-muted-foreground">{membros.length} colaboradores cadastrados</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gold-gradient text-primary-foreground font-semibold hover:opacity-90">
              <Upload className="w-4 h-4 mr-2" /> Importar CSV
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Importar Colaboradores</DialogTitle>
            </DialogHeader>
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${dragging ? "border-accent bg-accent/5" : "border-border"}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <FileUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
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
                <p className="text-sm text-emerald-500 mt-4 font-medium">✓ 5 colaboradores importados com sucesso!</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <GlassCard className="animate-fade-in-up">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={filtroNivel} onValueChange={setFiltroNivel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os níveis</SelectItem>
              <SelectItem value="Atleta">Atleta</SelectItem>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Sedentário">Sedentário</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead className="text-right">Passos/dia</TableHead>
              <TableHead className="text-right">Pontos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((m) => (
              <TableRow key={m.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{m.nome}</TableCell>
                <TableCell className="text-muted-foreground">{m.email}</TableCell>
                <TableCell><Badge variant="outline" className={nivelColors[m.nivel]}>{m.nivel}</Badge></TableCell>
                <TableCell className="text-right font-mono">{m.passos.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono font-semibold">{m.pontos}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground flex items-center gap-1"><Users className="w-4 h-4" /> {filtered.length} de {membros.length} colaboradores</p>
        </div>
      </GlassCard>
    </div>
  );
}
