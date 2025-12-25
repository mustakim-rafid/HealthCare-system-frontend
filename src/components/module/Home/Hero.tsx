"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Sparkles, Loader2 } from "lucide-react";
import { DoctorSuggestion } from "@/types/common";
import { toast } from "sonner";
import { getAiDoctorSuggestion } from "@/services/ai/ai.service";
import BookAppointmentDialog from "../Consultation/BookAppointmentDialog";
import { IDoctor } from "@/types/doctor.interface";

export function HeroSection() {
  const [symptoms, setSymptoms] = useState("");
  const [searched, setSearched] = useState(false);
  const [doctors, setDoctors] = useState<DoctorSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor>();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await getAiDoctorSuggestion(symptoms);
      if (!result.success) {
        toast.error(
          result.message || "Something went wrong while finding doctors"
        );
        return;
      }
      setDoctors(result.data);
      toast.success(
        result.message || "AI suggested doctors retrieved successfully"
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while finding doctors");
    } finally {
      if (!symptoms.trim()) return;
      setSearched(true);
      setIsLoading(false);
      setTimeout(() => {
        document.getElementById("data-section")?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  return (
    <section className="relative min-h-screen bg-linear-to-br from-background via-background to-accent/5 pt-10 pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <Badge variant="secondary" className="gap-2">
              <Sparkles className="w-3 h-3" />
              AI-Powered Doctor Matching
            </Badge>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
            Find Your Perfect Doctor in{" "}
            <span className="text-accent">Seconds</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance">
            Describe your symptoms and let our AI match you with the most
            suitable doctors. Book video consultations instantly.
          </p>
        </div>

        {/* AI Symptom Input Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="p-8 border-2 border-accent/20 shadow-lg backdrop-blur-sm bg-background/80">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Stethoscope className="w-5 h-5 text-accent" />
                <label className="text-sm font-semibold text-foreground">
                  Describe your symptoms
                </label>
              </div>

              <div className="flex gap-2 items-center">
                <Input
                  placeholder="e.g., headache, fever, cough, chest pain..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="text-base h-12 border-accent/30 focus:border-accent"
                />
                <Button
                  type="submit"
                  disabled={!symptoms.trim()}
                  className="px-8 gap-2 bg-accent hover:bg-accent/90 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      <span className="hidden sm:inline">Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span className="hidden sm:inline">Find Doctors</span>
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Our AI analyzes your symptoms and recommends the best
                specialists for you.
              </p>
            </form>
          </Card>
        </div>

        {/* Doctors Results */}
        {searched && (
          <div id="data-section" className="max-w-4xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Recommended Doctors
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {doctors.map((doctor, index) => (
                  <div key={index}>
                    <Card className="flex flex-col justify-between p-6 border-accent/20 hover:border-accent/50 transition-all hover:shadow-md cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">
                            {doctor.suggestedDoctor}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {doctor.specialization}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-accent border-accent/50"
                        >
                          ⭐ {doctor.rating}
                        </Badge>
                      </div>

                      <p className="text-sm text-foreground mb-4 text-justify tracking-tight">
                        <Sparkles className="w-4 h-4 mb-2" />
                        {doctor.reason}
                      </p>

                      <Button
                        onClick={() => {
                          setSelectedDoctor(doctor.doctorInfo);
                          setShowScheduleModal(true);
                        }}
                        className="w-full bg-accent hover:bg-accent/90"
                        size="sm"
                      >
                        Book Appointment
                      </Button>
                    </Card>

                    <BookAppointmentDialog
                      doctor={selectedDoctor as IDoctor}
                      isOpen={showScheduleModal}
                      onClose={() => {
                        setShowScheduleModal(false);
                        setSelectedDoctor(undefined);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-8">
              <Button
                variant="outline"
                className="dark:hover:bg-primary cursor-pointer"
                onClick={() => {
                  setSearched(false);
                  setSymptoms("");
                  setDoctors([]);
                }}
              >
                Search Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
