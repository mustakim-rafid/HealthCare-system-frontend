import DashboardSidebar from "@/components/module/Dashboard/DashboardSidebar"
import { ReactNode } from "react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import DashboardNavbar from "@/components/module/Dashboard/DashboardNavbar"
import { Metadata } from "next"

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
}

const DashboardLayout = ({ children }: {
    children: ReactNode
}) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full overflow-hidden">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DashboardNavbar />
          </div>
        </header>
        <Separator />
        {/* SidebarInset already renders <main>, so the skip-link target is a div */}
        <div id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout