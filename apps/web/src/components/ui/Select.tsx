"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formControlClass } from "../ui";

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
};

type SelectProps<T extends string = string> = {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
};

export function Select<T extends string = string>({
  value,
  options,
  onChange,
  placeholder = "Seç",
  className = "",
  triggerClassName = "",
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((current) => !current)}
        className={`flex min-h-[48px] w-full items-center justify-between gap-3 rounded-[18px] px-4 py-3 text-left font-bold ${formControlClass} ${triggerClassName}`}
      >
        <span className={selected ? "truncate" : "truncate text-purple/55"}>{selected?.label || placeholder}</span>
        <span className={`text-lg leading-none transition ${isOpen ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-[9999] max-h-72 overflow-auto rounded-[22px] border border-[rgba(93,84,145,0.2)] bg-white p-2 text-purple shadow-[0_22px_54px_rgba(93,84,145,0.22)]"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
                  isSelected ? "bg-yellow text-purple" : "bg-transparent text-purple hover:bg-lilac"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
