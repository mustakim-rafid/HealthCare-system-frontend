import InfoRow from "@/components/shared/InfoRow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { IPatient } from "@/types/patient.interface";
import { formatDateTime, getInitials } from "@/utils/formatters";
import {
  Activity,
  Calendar,
  Droplet,
  FileText,
  Heart,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

interface IPatientViewDialogProps {
  open: boolean;
  onClose: () => void;
  patient: IPatient | null;
}

const PatientViewDetailDialog = ({
  open,
  onClose,
  patient,
}: IPatientViewDialogProps) => {
  if (!patient) {
    return null;
  }

  const healthData = patient.patientHealthData;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-[90vw] lg:w-[85vw] xl:w-[70vw] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4">
          <DialogTitle className="text-lg sm:text-xl">
            Patient Profile
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
          {/* Patient Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 p-4 sm:p-6 bg-muted dark:from-blue-950 dark:to-indigo-950 rounded-lg mb-6">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white shadow-lg">
              <AvatarImage
                src={patient?.profilePhoto || ""}
                alt={patient?.name}
              />
              <AvatarFallback className="text-xl sm:text-2xl">
                {getInitials(patient?.name || "")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-3xl font-bold mb-1">
                {patient?.name}
              </h2>

              <p className="text-muted-foreground mb-2 flex items-center justify-center sm:justify-start gap-2 text-sm">
                <Mail className="h-4 w-4" />
                {patient?.email}
              </p>

              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge
                  variant={patient?.isDeleted ? "destructive" : "default"}
                  className="text-xs sm:text-sm"
                >
                  {patient?.isDeleted ? "Inactive" : "Active"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Phone className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-base sm:text-lg">
                  Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Contact Number"
                    value={patient?.contactNumber || "Not provided"}
                  />
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Email"
                    value={patient?.email || "Not provided"}
                  />
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Address"
                    value={patient?.address || "Not provided"}
                  />
                </div>
              </div>
            </div>

            {/* Health Data */}
            {healthData && (
              <>
                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-base sm:text-lg">
                      Health Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                    {/* all InfoRow blocks unchanged */}
                  </div>
                </div>
              </>
            )}

            {/* Medical Reports */}
            {patient.medicalReport && patient.medicalReport.length > 0 && (
              <>
                <Separator />

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-base sm:text-lg">
                      Medical Reports
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {patient.medicalReport.map((report) => (
                      <div
                        key={report.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">
                              {report.reportName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatDateTime(report.createdAt)}
                            </div>
                          </div>
                        </div>

                        <a
                          href={report.reportLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline self-start sm:self-center"
                        >
                          View Report
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Account Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-base sm:text-lg">
                  Account Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Joined On"
                    value={formatDateTime(patient?.createdAt || "")}
                  />
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Last Updated"
                    value={formatDateTime(patient?.updatedAt || "")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientViewDetailDialog;
