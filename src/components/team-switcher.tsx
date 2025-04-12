import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "./Logo";

export function TeamSwitcher() {
  const { open } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Logo onlyIcon={open} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
