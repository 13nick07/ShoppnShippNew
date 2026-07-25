'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FAQPage() {
  const faqs = [
    {
      question: 'How does The Parcelo work?',
      answer: 'The Parcelo provides you with virtual addresses in multiple countries. You can use these addresses to shop from local stores, and we receive, store, and forward your packages to anywhere in the world.',
    },
    {
      question: 'What countries do you support?',
      answer: 'We currently support 7+ countries including USA, UK, India, UAE, China, Germany, and Japan. We are constantly expanding our network.',
    },
    {
      question: 'How much does it cost?',
      answer: 'We have plans starting from Free (with 1 virtual address) to Business ($99.99/month). Shipping costs are calculated separately based on weight, destination, and carrier.',
    },
    {
      question: 'Can I consolidate multiple packages?',
      answer: 'Yes! Package consolidation is available on all paid plans. This allows you to combine multiple packages into one shipment, saving significantly on shipping costs.',
    },
    {
      question: 'How long can packages be stored?',
      answer: 'Storage duration depends on your plan: Free (30 days), Basic (60 days), Pro (90 days), Business (180 days). After this period, storage fees may apply.',
    },
    {
      question: 'Which carriers do you work with?',
      answer: 'We partner with major international carriers including DHL, FedEx, UPS, and Aramex to ensure reliable and fast delivery worldwide.',
    },
    {
      question: 'Do you handle customs clearance?',
      answer: 'Yes, we assist with customs documentation and provide all necessary paperwork for smooth customs clearance. However, you are responsible for any customs duties and taxes.',
    },
    {
      question: 'Is my package insured?',
      answer: 'Basic insurance is included with all shipments. Additional insurance can be purchased for high-value items.',
    },
    {
      question: 'Can I return items?',
      answer: 'Returns depend on the store\'s policy. We can help facilitate returns to the original retailer if needed.',
    },
    {
      question: 'How do I track my shipments?',
      answer: 'All shipments come with tracking numbers. You can track them directly through your dashboard or the carrier\'s website.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">
          Find answers to common questions about The Parcelo
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-16 text-center bg-muted/30 rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
        <p className="text-muted-foreground mb-4">
          Our support team is here to help
        </p>
        <p className="text-sm">Email: info@theparcelo.com</p>
      </div>
    </div>
  );
}
