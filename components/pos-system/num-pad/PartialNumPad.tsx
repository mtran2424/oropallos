import { IoBackspaceOutline } from "react-icons/io5";
import PartialNumPadButton from "./PartialNumPadButton";

const PartialNumPad = ({
  onClearClick,
  onBackspaceClick,
  onNumberClick,
}: {
  onClearClick: () => void;
  onBackspaceClick: () => void;
  onNumberClick: (value: string) => void;
}) => {
  return (
    <div className="grid grid-cols-3 gap-x-1 gap-y-1 h-full w-full">
      {/* Clear inputs */}
      <PartialNumPadButton
        onClick={onClearClick}
      >
        Clear
      </PartialNumPadButton>

      <button />

      {/* Back space button */}
      <PartialNumPadButton
        onClick={onBackspaceClick}
      >
        <IoBackspaceOutline size={40} />
      </PartialNumPadButton>

      {/* Second Row */}
      <PartialNumPadButton
        onClick={() => onNumberClick("7")}
      >
        7
      </PartialNumPadButton>

      <PartialNumPadButton
        onClick={() => onNumberClick("8")}
      >
        8
      </PartialNumPadButton>

      <PartialNumPadButton
        onClick={() => onNumberClick("9")}
      >
        9
      </PartialNumPadButton>

      {/* Third Row */}
      <PartialNumPadButton
        onClick={() => onNumberClick("4")}
      >
        4
      </PartialNumPadButton>

      <PartialNumPadButton
        onClick={() => onNumberClick("5")}
      >
        5
      </PartialNumPadButton>

      <PartialNumPadButton
        onClick={() => onNumberClick("6")}
      >
        6
      </PartialNumPadButton>

      {/* Fourth Row */}
      <PartialNumPadButton
        onClick={() => onNumberClick("1")}
      >
        1
      </PartialNumPadButton>

      <PartialNumPadButton
        onClick={() => onNumberClick("2")}
      >
        2
      </PartialNumPadButton>

      <PartialNumPadButton
        onClick={() => onNumberClick("3")}
      >
        3
      </PartialNumPadButton>

      {/* Fifth Row */}
      <PartialNumPadButton
        columns={2}
        onClick={() => onNumberClick("0")}
      >
        0
      </PartialNumPadButton>

      <PartialNumPadButton
        onClick={() => onNumberClick("00")}
      >
        00
      </PartialNumPadButton>
    </div>
  );
}

export default PartialNumPad;