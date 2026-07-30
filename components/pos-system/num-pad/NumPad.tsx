import { IoBackspaceOutline } from "react-icons/io5";
import NumPadButton from "./NumPadButton";
import TypeSelectorButton from "./TypeSelectorButton";
import { MdKeyboardReturn } from "react-icons/md";

const NumPad = ({
  typeSelector,
  noSale,
  onQuantityClick,
  onClearClick,
  onBackspaceClick,
  onFifteenPercentClick,
  onTaxFreeClick,
  onOtherDiscountClick,
  onNumberClick,
  onTypeClick,
  onNoSaleClick,
  onConfirmClick,
}: {
  typeSelector?: boolean;
  noSale?: boolean;
  onQuantityClick: () => void;
  onClearClick: () => void;
  onBackspaceClick: () => void;
  onFifteenPercentClick: () => void;
  onTaxFreeClick: () => void;
  onOtherDiscountClick: () => void;
  onNumberClick: (value: string) => void;
  onTypeClick?: (value: string) => void;
  onNoSaleClick?: () => void;
  onConfirmClick: () => void;
}) => {
  return (
    <div className="grid grid-cols-4 gap-x-1 gap-y-1">
      {/* First Row */}

      {/* Multi item button */}
      <NumPadButton
        onClick={onQuantityClick}
      >
        @/for
      </NumPadButton>

      <button></button>

      {/* Clear inputs */}
      <NumPadButton
        onClick={onClearClick}
      >

        Clear
      </NumPadButton>

      {noSale ? <NumPadButton
        onClick={() => onNoSaleClick?.()}
      >

        No Sale
      </NumPadButton> :
        <button />
      }

      {/* Second Row */}
      <NumPadButton
        onClick={() => onNumberClick("7")}
      >
        7
      </NumPadButton>

      <NumPadButton
        onClick={() => onNumberClick("8")}
      >
        8
      </NumPadButton>

      <NumPadButton
        onClick={() => onNumberClick("9")}
      >
        9
      </NumPadButton>

      {/* Back space button */}
      <NumPadButton
        onClick={onBackspaceClick}
      >
        <IoBackspaceOutline size={40} />
      </NumPadButton>


      {/* Third Row */}
      <NumPadButton
        onClick={() => onNumberClick("4")}
      >
        4
      </NumPadButton>

      <NumPadButton
        onClick={() => onNumberClick("5")}
      >
        5
      </NumPadButton>

      <NumPadButton
        onClick={() => onNumberClick("6")}
      >
        6
      </NumPadButton>

      {/* 15% Discount Shortcut button */}
      <NumPadButton
        onClick={onFifteenPercentClick}
      >
        15%
      </NumPadButton>

      {/* Fourth Row */}
      <NumPadButton
        onClick={() => onNumberClick("1")}
      >
        1
      </NumPadButton>

      <NumPadButton
        onClick={() => onNumberClick("2")}
      >
        2
      </NumPadButton>

      <NumPadButton
        onClick={() => onNumberClick("3")}
      >
        3
      </NumPadButton>

      {/* Tax Free Discount Shortcut button */}
      <NumPadButton
        onClick={onTaxFreeClick}
      >
        Tax Free
      </NumPadButton>

      {/* Fifth Row */}
      <NumPadButton
        columns={2}
        onClick={() => onNumberClick("0")}
      >
        0
      </NumPadButton>

      <NumPadButton
        onClick={() => onNumberClick("00")}
      >
        00
      </NumPadButton>

      <NumPadButton
        onClick={onOtherDiscountClick}
      >
        Other Disc
      </NumPadButton>

      {typeSelector && <TypeSelectorButton
        onClick={() => {
          onTypeClick?.("Liquor");
        }}
      >
        Liquor
      </TypeSelectorButton>}

      {/* Wine type selector */}
      {typeSelector && <TypeSelectorButton
        onClick={() => {
          onTypeClick?.("Wine");
        }}
      >
        Wine
      </TypeSelectorButton>}
      {/* Confirm item button */}
      <button
        className="flex h-full w-full bg-blue-600 text-white font-semibold text-2xl p-5 justify-center items-center px-10 col-span-4
        hover:bg-zinc-400 hover:text-zinc-400 rounded-sm transition-colors ease-linear"
        onClick={onConfirmClick}
      >
        <MdKeyboardReturn size={40} />
      </button>
    </div>
  );
}

export default NumPad;