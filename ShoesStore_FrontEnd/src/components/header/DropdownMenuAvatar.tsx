import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeCheckIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

interface DropdownMenuAvatarProps {
  urlAvatar?: string;
  logOut?: () => void;
}

export function DropdownMenuAvatar({
  urlAvatar,
  logOut,
}: DropdownMenuAvatarProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage
              src={urlAvatar ?? "https://github.com/shadcn.png"}
              alt="avatar"
            />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <NavLink to="/account">
            <DropdownMenuItem>
              <BadgeCheckIcon />
              Account
            </DropdownMenuItem>
          </NavLink>
          <DropdownMenuItem>
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logOut}>
          <LogOutIcon />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
