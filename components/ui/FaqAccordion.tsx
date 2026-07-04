"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

const ORANGE = "#FF9F1C"; // primary-container
const WHITE = "#FFFFFF";

export interface FaqAccordionItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqAccordionItem[];
  defaultOpenIndex?: number;
  className?: string;
}

export default function FaqAccordion({
  items,
  defaultOpenIndex = 0,
  className = "",
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);
  const baseId = useId();

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const triggerId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div
            key={triggerId}
            className={`rounded-2xl border border-primary-container overflow-hidden shadow-sm transition-colors duration-300 ${
              isOpen ? "bg-white" : "bg-primary-container"
            }`}
          >
            <h3 className="m-0">
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={`w-full flex items-center justify-between gap-4 p-6 text-left font-bold text-xl transition-colors ${
                  isOpen ? "text-sage-blue" : "text-white"
                }`}
              >
                <span className="flex-1">{item.question}</span>
                <span
                  className="grid place-items-center shrink-0 rounded-full transition-colors duration-300"
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: isOpen ? ORANGE : WHITE,
                  }}
                >
                  <ChevronDown
                    size={16}
                    color={isOpen ? WHITE : ORANGE}
                    strokeWidth={2.5}
                    aria-hidden="true"
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>
            </h3>

            {/* Animation en CSS pur : grid-template-rows 0fr -> 1fr, pas de mesure de hauteur en JS */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-body-md leading-relaxed text-on-surface-variant">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
