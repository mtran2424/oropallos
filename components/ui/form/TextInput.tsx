import { motion } from "framer-motion";
import React, { ChangeEvent, KeyboardEvent, useState } from "react";

const TextInput = ({
  name,
  required,
  value,
  setValue,
  onChange,
  suggestions,
  children
}: {
  required?: boolean;
  name: string;
  value: string | undefined;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  suggestions?: string[];
  children?: React.ReactNode;
}) => {
  const [showSuggestions, setShowSuggestions] = useState<Boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const handleSelectSuggestion = (suggested: string) => {
    setValue(suggested);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions) {
      if (!showSuggestions || suggestions.length === 0) return;

      // Handle arrow keys for navigating suggestions
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % suggestions.length);
      }
      // Handle arrow keys for navigating suggestions
      else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev === 0 ? suggestions.length - 1 : prev - 1
        );
      }
      // Handle Enter key for selecting a suggestion
      else if ((e.key === "Tab" || e.key === "Enter") && highlightedIndex >= 0) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[highlightedIndex]);
      }
    }
  }

  return (
    <div className="relative w-full">
      <div
        className="relative flex flex-col
            border border-zinc-300 rounded-md
            px-4 py-3 text-md
            transition-all duration-200
          focus-within:border-blue-500
            focus-within:ring-2
          focus-within:ring-blue-500"
      >
        <input
          type="text"
          required={required}
          placeholder={name}
          value={value}
          onChange={(e) => {
            onChange(e);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            if (name.length >= 2) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className="peer w-full bg-transparent outline-none pt-1"
          onKeyDown={(e) => handleKeyDown(e)}
        />

        <label
          className={`absolute left-3 bg-white px-1
            transition-all duration-200
            pointer-events-none
            ${value ?
              "top-0 -translate-y-1/2 text-xs text-zinc-500 peer-focus:text-blue-500"
              : "top-1/2 -translate-y-1/2 text-zinc-500 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-blue-500"}`}
        >
          {name}
        </label>
      </div>
      {showSuggestions && suggestions && suggestions.length > 0 && (
        <motion.ul
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="border border-zinc-500 rounded-lg p-2 transition duration-200 ease-in-out w-full overflow-y-auto max-h-50"
        >
          {suggestions.map((suggestion, index) => (
            <motion.li
              key={index}
              className={
                `px-4 py-2 rounded-lg transition duration-200 ease-in-out cursor-pointer 
                              ${highlightedIndex === index ? "bg-blue-100" : "hover:bg-blue-50"}`
              }
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              {suggestion}
            </motion.li>
          ))}
        </motion.ul>
      )}
      {children}
    </div>
  );
}

export default TextInput;