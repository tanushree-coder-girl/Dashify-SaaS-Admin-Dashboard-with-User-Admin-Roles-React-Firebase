import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBookings,
  cancelBooking,
  updateBookingStatus,
  fetchPaymentStatus, // ✅ Payment Status API Add Kiya
} from "@services/bookingsApi";
import InputField from "@/components/TextField";
import CustomPagination from "@components/Pagination";
import CustomSelect from "@components/CustomSelect";
import Modal from "@components/Modal";
import BookingForm from "@pages/bookings/components/BookingForm";
import { FaExclamationCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@components/LoadingSpinner";
import CommonTable from "@/components/CommonTable";

const ITEMS_PER_PAGE = 5;

interface Booking {
  id: string;
  serviceTitle: string;
  category: string;
  price: number;
  status: "Pending" | "Approved" | "Rejected";
  userId: string;
}

interface BookingTableProps {
  isAdmin: boolean;
  userId?: string;
}

const BookingTable: React.FC<BookingTableProps> = ({ isAdmin, userId }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >("All");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ✅ **Fetch Bookings**
  const {
    data: bookings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => fetchBookings(isAdmin ? undefined : userId),
  });

  // ✅ **Fetch Payment Status for Each Booking**
  const { data: paymentStatuses = {} } = useQuery({
    queryKey: ["paymentStatuses", bookings.map((b) => b.id)],
    queryFn: async () => {
      const statusMap: { [key: string]: boolean } = {};
      await Promise.all(
        bookings.map(async (booking: any) => {
          statusMap[booking.id] = await fetchPaymentStatus(booking.id);
        })
      );
      return statusMap;
    },
    enabled: bookings.length > 0, // Jab tak bookings nahi aati tab tak ye run nahi hoga
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => cancelBooking(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      bookingId,
      status,
      userId,
      serviceTitle,
      price,
    }: {
      bookingId: string;
      status: "Approved" | "Rejected";
      userId: string;
      serviceTitle: string;
      price: number;
    }) =>
      updateBookingStatus({ bookingId, status, userId, serviceTitle, price }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] }),
  });

  // 🔍 **Search and Filter Bookings**
  const filteredBookings: any[] = bookings.filter(
    (booking: any) =>
      booking.serviceTitle.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || booking.status === filter)
  );

  // ✅ **Pagination Logic**
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-surface text-theme p-6 rounded-lg shadow-md">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <InputField
          id="search"
          type="text"
          placeholder="Search bookings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <CustomSelect
          options={["All", "Pending", "Approved", "Rejected"]}
          value={filter}
          onChange={(value: any) =>
            setFilter(value as "All" | "Pending" | "Approved" | "Rejected")
          }
        />
      </div>

      <CommonTable
        columns={["Service Name", "Category", "Price", "Status", "Actions"]}
        rows={paginatedBookings.map((booking: Booking) => (
          <tr
            key={booking.id}
            className="hover:bg-[var(--primary-hover-color)] transition-all"
          >
            <td className="p-3 border theme-border">{booking.serviceTitle}</td>
            <td className="p-3 border theme-border">{booking.category}</td>
            <td className="p-3 border theme-border">${booking.price}</td>
            <td className="p-3 border theme-border">
              <span
                className={`px-2 py-1 rounded-md text-white text-sm ${
                  booking.status === "Approved"
                    ? "bg-green-500"
                    : booking.status === "Pending"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {booking.status}
              </span>
            </td>
            <td className="p-3 border theme-border">
              {!isAdmin && booking.status === "Pending" && (
                <button
                  className="text-red-500"
                  onClick={() => cancelMutation.mutate(booking.id)}
                >
                  Cancel
                </button>
              )}
              {!isAdmin &&
                booking.status === "Approved" &&
                !paymentStatuses[booking.id] && (
                  <button
                    onClick={() => navigate("/dashboard/payments")}
                    className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                  >
                    Pay Now
                  </button>
                )}
              {isAdmin && booking.status === "Pending" && (
                <>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                    onClick={() =>
                      updateStatusMutation.mutate({
                        bookingId: booking.id,
                        status: "Approved",
                        userId: booking.userId,
                        serviceTitle: booking.serviceTitle,
                        price: booking.price,
                      })
                    }
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                    onClick={() =>
                      updateStatusMutation.mutate({
                        bookingId: booking.id,
                        status: "Rejected",
                        userId: booking.userId,
                        serviceTitle: booking.serviceTitle,
                        price: booking.price,
                      })
                    }
                  >
                    Reject
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
        isLoading={isLoading}
        isError={isError}
      />

      {filteredBookings.length > ITEMS_PER_PAGE && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {!isAdmin && (
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <h2 className="text-lg font-semibold mb-4">Book a New Service</h2>
          <BookingForm onClose={() => setModalOpen(false)} userId={userId} />
        </Modal>
      )}
    </div>
  );
};

export default BookingTable;
