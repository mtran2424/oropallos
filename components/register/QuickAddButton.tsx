const QuickAddButton = ({ label, type, price, onClick }: {
  label: string,
  type: string,
  price: number
  onClick: (name: string, type: string, price: number) => void
}) => {
  return (
    <button
      className="font-semibold bg-blue-900 text-white text-2xl hover:bg-zinc-400 hover:text-zinc-600 transition-colors ease-linear py-10 px-2 rounded-sm"
      onClick={() => onClick(label, type, price)}
    >
      {label}
    </button>
  );
}

export default QuickAddButton;