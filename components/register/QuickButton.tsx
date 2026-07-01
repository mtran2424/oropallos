const QuickButton = ({ label, type, units, price, onClick }: {
  label: string,
  type: string,
  units: number,
  price: number
  onClick: (name: string, type: string, units: number, price: number) => void
}) => {
  //TODO: Create modal to complete functionality of quick add buttons
  return (
    <button
      key={label}
      className="font-semibold bg-blue-900 text-white text-2xl hover:bg-zinc-400 hover:text-zinc-600 transition-colors ease-linear py-10 px-2 rounded-sm"
      onClick={() => onClick(label, type, units, price)}
      disabled
    >
      {label}
    </button>
  );
}

export default QuickButton;