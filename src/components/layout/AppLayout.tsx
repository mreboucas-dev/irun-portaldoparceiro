import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { PageTransition } from "@/components/PageTransition";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 flex items-center px-4 glass-header sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">iRun</span>
              <span className="text-sm text-muted-foreground">Portal do Parceiro</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-8">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
