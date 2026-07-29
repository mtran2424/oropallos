const PartialNumPadButton = ({
  columns,
  children,
  onClick
}: {
  columns?: number;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      className={`flex p-5 h-full w-full bg-zinc-600 
        text-white font-semibold m-0.5 text-xl justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 rounded-sm transition-colors ease-linear
        ${columns ? `col-span-${columns}` : ""}
        `}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default PartialNumPadButton;