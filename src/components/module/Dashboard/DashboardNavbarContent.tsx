"use client";

import { Menu } from "lucide-react";
import { UserInfo } from "@/types/user.interface";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mode-toggler";
import LogoutButton from "@/components/shared/LogoutButton";
import { capitalize } from "@/utils/formatters";
import Link from "next/link";
import GlobalSearch from "./GlobalSearch";
import NotificationBell from "./NotificationBell";

const DashboardNavbarContent = ({ userInfo }: { userInfo: UserInfo }) => {
  return (
    <div className="flex flex-1 min-w-0 items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <GlobalSearch role={userInfo.role} />
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell allHref="/notifications" />
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer" asChild>
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage
                src="https://cdn-icons-png.flaticon.com/512/9385/9385289.png"
                alt="profilePhoto"
              />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={"bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage
                    src="https://cdn-icons-png.flaticon.com/512/9385/9385289.png"
                    alt="profilePhoto"
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {capitalize(userInfo.role)}
                  </span>
                  <span className="truncate text-xs">{userInfo.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup> 
              <Link href="/my-profile">
                <DropdownMenuItem className="cursor-pointer">
                  <Menu />
                  My profile
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <div className="m-2">
              <LogoutButton />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </div>
  );
};

export default DashboardNavbarContent;
