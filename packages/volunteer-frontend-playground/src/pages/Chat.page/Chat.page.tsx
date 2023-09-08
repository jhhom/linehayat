import { useNavigate } from "@solidjs/router";
import SidebarLayout from "~/layouts/Sidebar.layout";
import Chat from "~/pages/Chat.page/Chat";

export default function ChatPage() {
  const navigate = useNavigate();
  return (
    <SidebarLayout>
      <div class="h-full w-full">
        <div class="flex h-full w-full items-center justify-center">
          <Chat onHangup={() => navigate("/dashboard")} />
        </div>
      </div>
    </SidebarLayout>
  );
}
