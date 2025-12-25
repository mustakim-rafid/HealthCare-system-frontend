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
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link
                href={defaultDashboardPath}
                className="flex items-center gap-2"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-lg">
                      H
                    </span>
                  </div>
                </div>

                <span className="text-xl font-bold w-40 text-foreground sm:inline">
                  Health Care
                </span>
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
