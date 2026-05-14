import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "Delivery usually takes between 30 minutes to 2 hours depending on your location.",
  },
  {
    question: "Can I request a custom cake?",
    answer:
      "Yes. You can submit a custom cake request with your design inspiration.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept bank transfer, card payments, and cash on delivery.",
  },
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="bg-[#FFF7D6] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 inline-flex rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700">
          FAQ
        </p>

        <h1 className="text-5xl font-black text-slate-900">
          Frequently asked questions.
        </h1>

        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => (
            <article
              key={faq.question}
              className="overflow-hidden rounded-[28px] bg-white shadow-lg"
            >
              <button
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <h2 className="text-lg font-black text-slate-900">
                  {faq.question}
                </h2>

                <ChevronDown
                  className={`transition ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {activeIndex === index && (
                <div className="border-t border-slate-100 px-6 py-5">
                  <p className="text-sm font-medium leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;