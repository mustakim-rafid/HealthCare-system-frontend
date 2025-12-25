"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IDoctor } from "@/types/doctor.interface";
import BookAppointmentDialog from "../Consultation/BookAppointmentDialog";

const DoctorCardHome = ({ doctor }: { doctor: IDoctor }) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const primarySpecialty =
    doctor.doctorSpeciality?.[0]?.speciality?.title || doctor.designation;

  return (
    <>
      <Card className="group relative overflow-hidden rounded-2xl border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Header */}
        <CardHeader className="relative flex items-center justify-start bg-muted/40 pt-8 pb-14">
          <Image
            src={doctor.profilePhoto || "/doctor-placeholder.png"}
            alt={doctor.name}
            width={96}
            height={96}
            className="absolute -bottom-12 rounded-full border-4 border-background shadow-md object-cover"
          />
        </CardHeader>

        {/* Content */}
        <CardContent className="pt-16 space-y-2 text-start">
          <CardTitle className="text-base font-semibold leading-tight flex flex-wrap items-center gap-2">
            <span>{doctor.name}</span>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
              {primarySpecialty}
            </span>
          </CardTitle>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="font-medium text-foreground">
              {doctor.averageRating?.toFixed(1) || "0.0"}
            </span>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-1">
            {doctor.currentWorkingPlace}
          </p>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex gap-2 px-6 pb-6">
          <Link
            href={`/consultation/doctor/${doctor.id}`}
            className="flex-1"
          >
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </Link>

          <Button
            className="flex-1 shadow-sm group-hover:shadow-md transition-shadow"
            onClick={() => setShowScheduleModal(true)}
          >
            Book Now
          </Button>
        </CardFooter>
      </Card>

      {/* Booking Modal */}
      <BookAppointmentDialog
        doctor={doctor}
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />
    </>
  );
};

export default DoctorCardHome;
