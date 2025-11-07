import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Map,
  AlertTriangle,
  Users,
  Sprout,
  FileCode2,
  MessageSquare,
  Settings,
  Leaf,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export function AppSidebar() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { user } = useAuthStore();

  const officerMenuItems = [
    { title: t("nav.overview"), url: "/", icon: LayoutDashboard },
    { title: t("nav.map"), url: "/map", icon: Map },
    { title: t("nav.alerts"), url: "/alerts", icon: AlertTriangle },
    { title: t("nav.farmers"), url: "/farmers", icon: Users },
    { title: t("nav.rules"), url: "/rules", icon: FileCode2 },
    { title: t("nav.communications"), url: "/communications", icon: MessageSquare },
    { title: t("nav.messages"), url: "/messages", icon: MessageSquare },
  ];

  const menuItems = user?.role === "FARMER" 
    ? [
        { title: t("nav.home"), url: "/", icon: Sprout },
        { title: t("nav.plots"), url: "/plots", icon: Map },
        { title: t("nav.advisories"), url: "/advisories", icon: MessageSquare },
      ]
    : officerMenuItems;

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Leaf className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{t("app.title")}</span>
            <span className="text-xs text-muted-foreground">{t("app.subtitle")}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("nav.home")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`sidebar-nav-${item.url.slice(1) || "home"}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Link href="/settings">
          <SidebarMenuButton className="w-full" data-testid="sidebar-nav-settings">
            <Settings className="h-4 w-4" />
            <span>{t("nav.settings")}</span>
          </SidebarMenuButton>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
