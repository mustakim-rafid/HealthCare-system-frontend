"use client";

import { logoutUser } from "@/services/auth/logoutUser";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const handleLogout = async () => {
    await logoutUser();
  };
  return (
    <div>
      <Button className="cursor-pointer" variant={"destructive"} onClick={handleLogout}>
        <LogOut />
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;
