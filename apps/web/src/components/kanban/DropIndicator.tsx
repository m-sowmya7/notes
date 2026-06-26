export const DropIndicator = ({ beforeId, column }: {
  beforeId: string | null;
  column: string;
}) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-1 h-0.5 w-full bg-[#FFC6C6] opacity-0"
    />
  );
};