import type { Metadata } from "next";
import MyProfile from "@/components/module/MyProfile/MyProfile";
import { getUserInfoForProfile } from "@/services/auth/getUserInfo";

export const metadata: Metadata = {
  title: "My Profile",
};

const MyProfilePage = async () => {
  const userInfo = await getUserInfoForProfile();
  return (
    <div className="p-4"> 
      <MyProfile userInfo={userInfo!} />
    </div>
  );
};

export default MyProfilePage;
