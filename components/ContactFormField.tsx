"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ContactFormField.module.css";

export type FormField = {
  fieldId: string;
  fieldType: "text" | "email" | "tel" | "textarea" | "select" | "url" | "number" | "file" | "checkbox";
  label?: Record<string, string>;
  placeholder?: Record<string, string>;
  options?: Record<string, string>[];
  width?: "full" | "half";
  required?: boolean;
};

type ContactFormFieldProps = {
  field: FormField;
  locale: string;
  fieldClassName?: string;
  fieldFullClassName?: string;
  defaultValue?: string;
};

export default function ContactFormField({
  field,
  locale,
  fieldClassName = "",
  fieldFullClassName = "",
  defaultValue,
}: ContactFormFieldProps) {
  const label = field.label?.[locale];
  const placeholder = field.placeholder?.[locale];

  return (
    <div className={`${fieldClassName} ${field.width === "full" ? fieldFullClassName : ""}`}>
      <label
        htmlFor={field.fieldId}
        className="text-size-small text-color-tertiary text-transform-uppercase"
      >
        {label}
      </label>

      {field.fieldType === "textarea" ? (
        <textarea id={field.fieldId} name={field.fieldId} placeholder={placeholder} required={field.required} rows={4} defaultValue={defaultValue} />
      ) : field.fieldType === "select" ? (
        <RadioDropdown field={field} locale={locale} placeholder={placeholder} />
      ) : field.fieldType === "checkbox" ? (
        <input type="checkbox" id={field.fieldId} name={field.fieldId} required={field.required} />
      ) : (
        <input
          type={field.fieldType}
          id={field.fieldId}
          name={field.fieldId}
          placeholder={placeholder}
          required={field.required}
          defaultValue={defaultValue}
        />
      )}
    </div>
  );
}

function RadioDropdown({
  field,
  locale,
  placeholder,
}: {
  field: FormField;
  locale: string;
  placeholder?: string;
}) {
  const options = field.options ?? [];
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(
    options[0]?.[locale] ?? null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectOption(value: string) {
    setSelected(value);
    setIsOpen(false);
  }

  return (
    <div className={styles.dropdown} ref={containerRef}>
      <button
        type="button"
        id={field.fieldId}
        className={styles.dropdownTrigger}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        <span className={selected ? "" : styles.dropdownPlaceholder}>
          {selected ?? placeholder}
        </span>
        <span className="material-symbols-outlined">expand_more</span>
      </button>

      {isOpen && (
        <div className={styles.dropdownPanel}>
          {options.map((option) => {
            const value = option[locale];
            return (
              <label key={value} className={styles.dropdownOption}>
                <input
                  type="radio"
                  name={`${field.fieldId}-option`}
                  checked={selected === value}
                  onChange={() => selectOption(value)}
                />
                <span>{value}</span>
              </label>
            );
          })}
        </div>
      )}

      {selected && <input type="hidden" name={field.fieldId} value={selected} />}
    </div>
  );
}
