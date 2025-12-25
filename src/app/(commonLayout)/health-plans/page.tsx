import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { CheckCircle, Shield, Users, Zap } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Health Care – Health Plans",
}

const HealthPlansPage = () => {

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Health Plans & Packages
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose a health plan that fits your needs. All plans include access to
          our network of qualified healthcare professionals.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          {
            icon: Shield,
            title: "Comprehensive Coverage",
            desc: "Wide range of medical services",
          },
          { icon: Users, title: "Family Plans", desc: "Cover your loved ones" },
          {
            icon: Zap,
            title: "Quick Access",
            desc: "Fast appointment booking",
          },
          {
            icon: CheckCircle,
            title: "Quality Care",
            desc: "Verified healthcare professionals",
          },
        ].map((benefit, idx) => {
          const Icon = benefit.icon;
          return (
            <Card key={idx} className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Plan?</h2>
          <p className="text-muted-foreground mb-6">
            Contact us to create a healthcare plan tailored to your specific
            needs
          </p>
          <Button size="lg" variant="outline">
            Contact Sales
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthPlansPage;
