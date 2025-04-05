import { useState } from "react";
import { Mail, PhoneCall, MessageCircle } from "lucide-react";
import InputField from "@/components/TextField";
import PageHeader from "@components/PageHeader";
import faqs from "@data/faqs";
import FAQItem from "@pages/help/components/FAQItem";
import ContactItem from "@pages/help/components/ContactItem";

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Help & Support" subtitle="We are here to help you" />

      <div className="mb-8 max-w-xl mx-auto px-4">
        <InputField
          id="search-query"
          type="text"
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-0">
        {/* FAQ Section */}
        <div className="md:col-span-8 p-6 md:p-8 bg-surface shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold text-theme mb-6">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))
            ) : (
              <p className="text-secondary">No results found.</p>
            )}
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="md:col-span-4 p-6 md:p-8 bg-surface shadow-lg rounded-lg mt-6 md:mt-0">
          <h3 className="text-xl font-semibold text-theme mb-6">
            Contact Support
          </h3>
          <p className="text-secondary mb-6 text-sm">
            Need further assistance? Reach out to our support team. We’re here
            to help!
          </p>

          <div className="space-y-4">
            <ContactItem
              icon={Mail}
              label="support@example.com"
              href="mailto:support@example.com"
            />
            <ContactItem
              icon={PhoneCall}
              label="(123) 456-7890"
              href="tel:+11234567890"
            />
            <ContactItem
              icon={MessageCircle}
              label="Live Chat Support"
              href="/support/chat"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;
