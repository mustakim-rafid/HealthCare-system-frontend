export const dynamic = "force-dynamic";

import FAQ from "@/components/module/Home/FAQ";
import { HeroSection } from "@/components/module/Home/Hero";
import Specialities from "@/components/module/Home/Medicine";
import Steps from "@/components/module/Home/Steps";
import TopDoctorsPage from "@/components/module/Home/TopDoctors";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Separator />
      <Steps />
      <Separator />
      <TopDoctorsPage />
      <Separator /> 
      <Specialities />
      <Separator /> 
      <FAQ />
    </div>
  );
}
