import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import AppRouter from "@/routes/AppRouter";
import ScreenshotModeToggle from "@/components/ScreenshotModeToggle";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors position="bottom-right" />
      <AppRouter />
      <ScreenshotModeToggle />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;