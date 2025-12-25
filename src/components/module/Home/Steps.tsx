import {
  Search,
  ClipboardList,
  CalendarCheck,
  ShieldCheck,
  FileText,
  Video,
  CreditCard,
  HeartPulse,
} from "lucide-react";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  { icon: Search, title: "Search Doctor", description: "Find your doctor easily with a minimum of effort." },
  { icon: ClipboardList, title: "Check Doctor Profile", description: "Get to know your doctor better." },
  { icon: CalendarCheck, title: "Schedule Appointment", description: "Choose the time and date that suits you." },
  { icon: ShieldCheck, title: "Get Your Solution", description: "Our doctors are here to help you." },
  { icon: FileText, title: "Electronic prescription", description: "Get your prescription instantly." },
  { icon: Video, title: "Instant video consultation", description: "Consult with your doctor from anywhere." },
  { icon: CreditCard, title: "Easy payment options", description: "Pay with ease using various methods." },
  { icon: HeartPulse, title: "Health recovery", description: "Start your journey to better health." },
];

const StepCard = ({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) => {
  const bgColors = [
    "bg-muted/40",
    "bg-muted/50",
    "bg-muted/40",
    "bg-muted/50",
    "bg-muted/40",
    "bg-muted/50",
    "bg-muted/40",
    "bg-muted/50",
  ];

  const iconColors = [
    "text-primary",
    "text-secondary-foreground",
    "text-primary",
    "text-secondary-foreground",
    "text-primary",
    "text-secondary-foreground",
    "text-primary",
    "text-secondary-foreground",
  ];

  return (
    <Card className={bgColors[index % 8]}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-background p-3 shadow-sm">
            <Icon className={`h-6 w-6 ${iconColors[index % 8]}`} />
          </div>
          <div>
            <h3 className="font-bold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Steps = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground">
            Easy Steps to Get Your Solution
          </h2>
          <p className="mt-4 text-muted-foreground">
            We provide advanced technologies and high-quality surgery facilities right here.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;
