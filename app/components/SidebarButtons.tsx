import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft, SquarePen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export function SidebarTrigger({
  windowWidth,
}: {
  windowWidth: number | null;
}) {
  const { toggleSidebar, open } = useSidebar();

  const tooltipText =
    windowWidth !== null && (windowWidth < 768 || !open)
      ? "Open Sidebar"
      : "Close Sidebar";
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <PanelLeft />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function SidebarNewConversation() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/chat">
            <Button variant="ghost" size="icon">
              <SquarePen />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>New Conversation</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
