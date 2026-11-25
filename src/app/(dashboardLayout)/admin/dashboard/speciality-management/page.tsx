import type { Metadata } from "next";
import SpecialityManagement from "@/components/module/Admin/speciality/SpecialityManagement";
import { serverFetch } from "@/lib/serverFetch";

export const metadata: Metadata = {
  title: "Speciality Management",
};

const SpecialtyManagementPage = async () => {
  const res = await serverFetch.get("/speciality");
  const result = await res.json();

  return <SpecialityManagement data={result.data} />
};

export default SpecialtyManagementPage;
