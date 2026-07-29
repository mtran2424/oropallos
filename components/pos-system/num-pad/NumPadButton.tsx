const NumPadButton = ({
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
      className={`flex h-full w-full 
        bg-zinc-600 text-white font-semibold text-2xl 
        p-5 justify-center items-center
        hover:bg-zinc-200 hover:text-zinc-400 
        rounded-sm transition-colors ease-linear
        ${columns ? `col-span-${columns}` : ""}
        `}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default NumPadButton;