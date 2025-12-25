"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqData = [
  {
    question: "How do I find a doctor?",
    answer:
      "Use the search feature to find your preferred doctor easily. You can filter by speciality, location, or availability.",
  },
  {
    question: "How can I check a doctor's profile?",
    answer:
      "Click on 'View Details' on any doctor card to see their full profile, qualifications, experience, and specialties.",
  },
  {
    question: "How do I schedule an appointment?",
    answer:
      "Select a doctor, choose a convenient date and time, and click 'Book Appointment'. You will receive a confirmation instantly.",
  },
  {
    question: "How can I get prescriptions?",
    answer:
      "After your consultation, doctors provide an electronic prescription which you can access from your account or via email.",
  },
  {
    question: "What payment methods are available?",
    answer:
      "We support multiple payment methods including credit/debit cards and online banking, making the process simple and secure.",
  },
];

const FAQ = () => {
  return (
    <section className="py-20 bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground dark:text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-muted-foreground dark:text-muted-foreground">
            Find answers to the most common questions about our services and
            process.
          </p>
        </div>

        <div className="w-full">
          <Accordion type="single" collapsible className="w-full space-y-6">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="w-full border rounded-2xl border-muted/30 dark:border-muted/50 bg-muted/40 dark:bg-muted/30 shadow-sm"
              >
                <AccordionTrigger className="w-full px-8 py-6 text-foreground dark:text-foreground font-medium text-left text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="w-full px-8 pb-6 pt-0 text-muted-foreground dark:text-muted-foreground text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
