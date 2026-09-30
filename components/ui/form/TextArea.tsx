import { ChangeEvent } from "react";

/**
 * Custom text area component for forms, providing a styled text area with label and focus effects.
 * 
 * @param name - Name of the text area, used for labeling and identification
 * @param value - Controlling state of the text area
 * @param setValue - Controlling state to update the value of the text area
 * @returns 
 */
const TextArea = ({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
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

        <textarea
          className="peer w-full bg-transparent outline-none pt-1"
          onChange={(e) => onChange(e)}
        ></textarea>

        <label
          className={`absolute left-3 bg-white px-1
            transition-all duration-200
            pointer-events-none
            ${value ?
              "top-0 -translate-y-1/4 text-xs text-zinc-500 peer-focus:text-blue-500"
              : "top-1/4 -translate-y-1/4 text-zinc-500 peer-focus:top-0 peer-focus:-translate-y-1/4 peer-focus:text-xs peer-focus:text-blue-500"}`}
        >
          {name}
        </label>
      </div>
    </div>
  );
}

export default TextArea;