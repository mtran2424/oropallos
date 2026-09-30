import { motion } from "framer-motion";
import React, { ChangeEvent, KeyboardEvent, useState } from "react";

const NumInput = ({
  name,
  required,
  value,
  inputMode,
  step,
  min,
  onChange,
  children
}: {
  required?: boolean;
  name: string;
  value: string | number;
  inputMode?: "decimal" | "email" | "none" | "numeric" | "search" | "tel" | "text" | "url" | undefined;
  step?: string | number | undefined;
  min?: string | number | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}) => {

  return (
    <div className="relative w-full">
      <div
        className="relative flex flex-col
            border border-zinc-300 rounded-md
            px-4 py-3
            transition-all duration-200
          focus-within:border-blue-500
            focus-within:ring-2
          focus-within:ring-blue-500"
      >
        <input
          type="number"
          inputMode={inputMode ?? undefined}
          step={step ?? undefined}
          min={min ?? undefined}
          required={required}
          placeholder={name}
          value={value}
          onChange={(e) => {
            onChange(e);
          }}
          className="peer w-full bg-transparent outline-none pt-1"
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
      {children}
    </div>
  );
}

export default NumInput;