import { BookOpen, Library, Rows3 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import NavUser from "./NavUser";
import type { Page } from "./types";

const items: { page: Page; title: string; icon: typeof BookOpen }[] = [
  { page: "books", title: "Bücher", icon: BookOpen },
  { page: "shelves", title: "Regale", icon: Rows3 },
  { page: "libraries", title: "Bibliotheken", icon: Library },
];

type AppSidebarProps = {
  page: Page;
  setPage: (page: Page) => void;
  onScannerClick: () => void;
};

function AppSidebar({ page, setPage, onScannerClick }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className='p-4'>
        <div className='flex items-center gap-1'>
          <img
            src='/mittwald-icon.png'
            alt='mBooks Studio'
            className='h-6 w-6'
          />
          <span className='text-sm font-medium'>mBooks Studio</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Verwaltung</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.page}>
                  <SidebarMenuButton
                    isActive={page === item.page}
                    tooltip={item.title}
                    onClick={() => setPage(item.page)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <NavUser onScannerClick={onScannerClick} />
    </Sidebar>
  );
}

export default AppSidebar;
