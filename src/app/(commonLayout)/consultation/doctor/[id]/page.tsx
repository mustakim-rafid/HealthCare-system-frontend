import DoctorProfileContent from "@/components/module/DoctorDetails/DoctorProfileContent";
import DoctorReviews from "@/components/module/DoctorDetails/DoctorReviews";
import { getDoctorById } from "@/services/admin/doctorManagement";

const DoctorDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const result = await getDoctorById(id);
  return (
    <div className="container mx-auto p-8 space-y-6">
      <DoctorProfileContent doctor={result.data} />
      <DoctorReviews doctorId={id} />
    </div>
  );
};

export default DoctorDetailPage;