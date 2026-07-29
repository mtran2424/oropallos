const TypeSelectorButton = ({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      className="flex h-full w-full bg-zinc-800 text-white font-semibold text-2xl p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear col-span-2"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default TypeSelectorButton;