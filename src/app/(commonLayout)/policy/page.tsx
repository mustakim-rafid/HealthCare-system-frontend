export const dynamic = "force-static";

const PolicyPage = () => {
  return (
    <section className="py-20 bg-linear-to-r from-primary/5 via-secondary/5 to-accent/5">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
            Healthcare Policies
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Platform Policies & Patient Rights
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            These policies outline how our healthcare platform operates, ensuring
            patient safety, data protection, and high-quality medical services.
          </p>
        </div>

        {/* Policy Content */}
        <div className="bg-card border border-border rounded-2xl p-8 md:p-10 space-y-12 shadow-sm">
          {/* Account & Access */}
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-foreground">
              User Accounts & Access
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Patients and healthcare professionals must provide accurate and
              complete information during registration. Secure authentication
              mechanisms are implemented to protect accounts and ensure safe
              access to medical services.
            </p>
          </div>

          {/* Medical Consultations */}
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-foreground">
              Medical Consultations & Appointments
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Appointments can be scheduled, rescheduled, or canceled based on
              availability and platform guidelines. Doctors are responsible for
              maintaining professional standards and providing accurate medical
              guidance.
            </p>
          </div>

          {/* Prescriptions */}
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-foreground">
              Prescriptions & Medical Records
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Electronic prescriptions and medical records are issued only by
              licensed professionals. Patients may access their records securely
              while the platform ensures confidentiality and data integrity.
            </p>
          </div>

          {/* Payments */}
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-foreground">
              Payments & Billing
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Consultation fees and services are processed through trusted and
              secure payment providers. The platform does not store sensitive
              payment information such as card numbers or verification codes.
            </p>
          </div>

          {/* Privacy */}
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-foreground">
              Data Protection & Privacy
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Patient data is handled with strict confidentiality and in
              compliance with healthcare privacy regulations. Information is
              used solely to improve care quality, security, and platform
              performance.
            </p>
          </div>

          {/* Conduct */}
          <div className="space-y-3">
            <h3 className="text-2xl font-semibold text-foreground">
              User Conduct & Responsibility
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              All users are expected to communicate respectfully and honestly.
              Any misuse of medical services, misleading information, or
              inappropriate behavior may result in restricted access or account
              suspension.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PolicyPage