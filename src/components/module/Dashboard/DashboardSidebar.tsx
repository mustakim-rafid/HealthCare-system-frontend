import { getUserInfo } from "@/services/auth/getUserInfo";
import { getDefaultDashboardRoute } from "@/utils/auth-utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import NavMain from "./NavMain";
import NavUser from "./NavUser";
import Logo from "@/components/shared/Logo";
import { getNavMainItemsByRole } from "@/utils/navItems.config";

const DashboardSidebar = async () => {
  const userInfo = await getUserInfo();

  const navMainItems = getNavMainItemsByRole(userInfo!.role)

  const defaultDashboardPath = getDefaultDashboardRoute(userInfo!.role);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="Health Care dashboard"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link href={defaultDashboardPath} aria-label="Health Care dashboard">
                <Logo textClassName="text-xl" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser userInfo={userInfo!} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
