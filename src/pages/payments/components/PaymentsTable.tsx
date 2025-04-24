import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPayments } from "@services/paymentsApi";
import InputField from "@/components/TextField";
import CustomPagination from "@components/Pagination";
import CustomSelect from "@components/CustomSelect";
import Modal from "@components/Modal";
import PaymentForm from "@pages/payments/components/PaymentForm";
import CommonTable from "@/components/CommonTable";

const ITEMS_PER_PAGE = 5;

interface PaymentsTableProps {
  isAdmin: boolean;
  userId?: string;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({ isAdmin, userId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Pending" | "Completed">("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );

  const {
    data: payments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["payments"],
    queryFn: () => fetchPayments(isAdmin, userId),
  });

  const filteredPayments = payments.filter(
    (payment: any) =>
      payment.serviceTitle.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || payment.paymentStatus === filter)
  );

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleOpenPaymentModal = (paymentId: string) => {
    setSelectedPaymentId(paymentId);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-surface text-theme p-6 rounded-lg shadow-md">
      {/* 🔹 Filters */}
      <div className="flex gap-4 flex-wrap justify-between items-center mb-4">
        <InputField
          id="search"
          type="text"
          placeholder="Search payments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <CustomSelect
          options={["All", "Pending", "Completed"]}
          value={filter}
          onChange={(value) =>
            setFilter(value as "All" | "Pending" | "Completed")
          }
        />
      </div>

      {/* 🔹 Table */}
      <CommonTable
        columns={
          isAdmin
            ? ["Service Name", "Price", "Payment Status"]
            : ["Service Name", "Price", "Payment Status", "Actions"]
        }
        rows={paginatedPayments.map((payment: any) => (
          <tr key={payment.id} className="transition-all">
            <td className="p-3 border theme-border">{payment.serviceTitle}</td>
            <td className="p-3 border theme-border">${payment.price}</td>
            <td className="p-3 border theme-border">
              <span
                className={`px-2 py-1 rounded-md text-theme text-sm ${
                  payment.paymentStatus === "Completed"
                    ? "bg-success"
                    : "bg-error"
                }`}
              >
                {payment.paymentStatus}
              </span>
            </td>
            {!isAdmin && (
              <td className="p-3 border theme-border">
                {payment.userId === userId &&
                  payment.paymentStatus === "Pending" && (
                    <button
                      onClick={() => handleOpenPaymentModal(payment.id)}
                      className="bg-primary text-theme px-4 py-2 rounded-md transition"
                    >
                      Pay Now
                    </button>
                  )}
              </td>
            )}
          </tr>
        ))}
        isLoading={isLoading}
        isError={isError}
        noDataText="No payments found."
      />

      {/* 🔹 Pagination */}
      {filteredPayments.length > ITEMS_PER_PAGE && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* 🔹 Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <PaymentForm
            paymentId={selectedPaymentId}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default PaymentsTable;
