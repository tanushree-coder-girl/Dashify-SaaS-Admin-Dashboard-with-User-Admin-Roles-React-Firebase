import { ReactNode } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";

interface CommonTableProps {
  columns: string[];
  rows: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  noDataText?: string;
}

const CommonTable: React.FC<CommonTableProps> = ({
  columns,
  rows,
  isLoading = false,
  isError = false,
  noDataText = "No data found.",
}) => {
  if (isLoading) return <LoadingSpinner />;

  if (isError)
    return <p className="text-center text-error">Failed to load data.</p>;

  if (!rows || (Array.isArray(rows) && rows.length === 0))
    return (
      <div className="flex flex-col items-center justify-center p-10 text-secondary">
        <FaExclamationCircle size={50} className="mb-2 text-secondary" />
        <p>{noDataText}</p>
      </div>
    );

  return (
    <div className="bg-surface overflow-x-auto rounded-lg shadow-md bg-surface">
      <table className="w-full overflow-x-auto border-collapse theme-border text-left">
        <thead>
          <tr className="text-theme">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="p-3 border theme-border whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

export default CommonTable;
