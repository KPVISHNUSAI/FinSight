"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";
import { LogOut, Settings, User, Loader2 } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function UserNav() {
  const { state } = useSidebar();
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader2 className="w-6 h-6 animate-spin" />;
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut(auth);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn(
            "w-full justify-start gap-2 p-2 h-auto",
            state === 'collapsed' && "w-auto aspect-square p-0"
        )}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || `https://placehold.co/100x100.png`} alt="User Avatar" data-ai-hint="user avatar" />
            <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
           <div className={cn("flex flex-col items-start", state === 'collapsed' && "hidden")}>
                <p className="text-sm font-medium">{user.displayName || "User"}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
