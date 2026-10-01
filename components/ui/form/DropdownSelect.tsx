
import React, { ChangeEvent, useState } from "react";

const DropdownSelect = ({
  id,
  name,
  required,
  value,
  onChange,
  children
}: {
  id: string;
  name: string;
  required?: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
}) => {

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
        <select
          id={id}
          required={required}
          value={value}
          onChange={(e) => {
            onChange(e);
          }}
          className="peer w-full bg-transparent outline-none pt-1"
        >
          {children}
        </select>

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

    </div>
  );
}

export default DropdownSelect;