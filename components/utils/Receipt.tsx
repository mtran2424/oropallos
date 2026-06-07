const Receipt = ({
  ref,
  title,
  children
}: {
  ref: React.RefObject<HTMLDivElement | null>,
  title?: string,
  children: React.ReactNode
}) => {
  return (
    <div ref={ref} className="flex flex-col w-full items-center text-md px-10 pb-10 receipt">
      <h1 className="font-bold text-center">OROPALLO'S</h1>
      <h1 className="font-bold text-center">WINE & LIQUOR</h1>
      <h1 className="text-center">376 DIX AVENUE</h1>
      <h1 className="text-center">QUEENSBURY, NY 12804</h1>
      <h1 className="font-bold text-center">518-798-3988</h1>
      {title && <h1 className="font-bold text-center mb-4">{title}</h1>}
      {children}
    </div>
  );
}

export default Receipt;