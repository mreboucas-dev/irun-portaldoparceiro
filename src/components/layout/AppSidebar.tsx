import logoIrun from "@/assets/logo-irun.png";
import {
  LayoutDashboard,
  Ticket,
  FileText,
  FileBarChart,
  ScanLine,
  Send,
  CalendarRange,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Validação de Cupom", url: "/validacao", icon: ScanLine },
  { title: "Meus Cupons", url: "/cupons", icon: Ticket },
  { title: "Planejamento", url: "/planejamento", icon: CalendarRange },
  { title: "Relatórios", url: "/relatorios", icon: FileBarChart },
  { title: "Contratos", url: "/contratos", icon: FileText },
  { title: "Solicitações", url: "/solicitacoes", icon: Send },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="glass-sidebar pt-4">
        {!collapsed && (
          <div className="px-6 pb-4 mb-2">
            <div className="flex items-center gap-3">
              <img src={logoIrun} alt="iRun Clube+" className="w-10 h-10 rounded-xl" />
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            {!collapsed && "Portal do Parceiro"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      end
                      className="transition-all duration-200 hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
