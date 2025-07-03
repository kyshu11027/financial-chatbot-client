import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfileDropdown() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleProfileSettings = () => {
    router.push("/chat/settings");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full hover:bg-accent hover:text-accent-foreground">
        <Image
          src="/logo.png"
          alt="Logo"
          width={45}
          height={45}
          className="rounded-full p-0.5"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-5">
        <DropdownMenuItem onClick={handleProfileSettings}>
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
