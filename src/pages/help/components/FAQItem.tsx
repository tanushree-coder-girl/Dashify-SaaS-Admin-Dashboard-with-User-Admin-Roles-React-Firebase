interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => (
  <details className="theme-border-b pb-4">
    <summary className="cursor-pointer font-semibold text-theme transition-colors duration-300">
      {question}
    </summary>
    <p className="text-secondary mt-2 text-sm">{answer}</p>
  </details>
);

export default FAQItem;
