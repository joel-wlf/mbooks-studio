import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  ScanBarcodeIcon,
  Settings,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

//fake account, no auth behind it yet
const user = {
  name: "Max Mustermann",
  email: "max.mustermann@mittwald.de",
  initials: "MM",
};

type NavUserProps = {
  onScannerClick: () => void;
};

function NavUser({ onScannerClick }: NavUserProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={onScannerClick}
            className='border-black border-1 mb-5 p-3 py-6 flex items-center justify-center gap-3'
          >
            <ScanBarcodeIcon className='size-6' />
            <span className='grid flex-1 text-left leading-tight'>
              <span className='text-sm font-medium'>Scanner Mode</span>
              <span className='text-muted-foreground text-xs text-wrap'>
                Bücher via Scan managen
              </span>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton size='lg' tooltip={user.name}>
                  <Avatar className='size-8 rounded-lg'>
                    <AvatarFallback className='rounded-lg'>
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left leading-tight'>
                    <span className='truncate font-medium'>{user.name}</span>
                    <span className='text-muted-foreground truncate text-xs'>
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className='ml-auto' />
                </SidebarMenuButton>
              }
            />

            <DropdownMenuContent
              className='w-(--anchor-width) min-w-56'
              side={isMobile ? "bottom" : "right"}
              align='end'
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex items-center gap-2 text-left'>
                    <Avatar className='size-8 rounded-lg'>
                      <AvatarFallback className='rounded-lg'>
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className='grid flex-1 leading-tight'>
                      <span className='truncate font-medium'>{user.name}</span>
                      <span className='text-muted-foreground truncate text-xs'>
                        {user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Konto
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Abrechnung
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  Einstellungen
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <LogOut />
                Abmelden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}

export default NavUser;
