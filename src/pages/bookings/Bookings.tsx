import { useState } from "react";
import PageHeader from "@components/PageHeader";
import Modal from "@components/Modal";
import BookingForm from "@pages/bookings/components/BookingForm";
import BookingTable from "@pages/bookings/components/BookingTable";
import { useAuth } from "@context/AuthContext";

const BookingsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ">
        <PageHeader
          title={isAdmin ? "Manage Bookings" : "My Bookings"}
          subtitle={
            isAdmin
              ? "View and manage all service bookings"
              : "View your bookings or book a new service"
          }
        />
        {!isAdmin && (
          <button
            className="bg-primary text-theme px-4 py-2 rounded-md self-start md:self-center"
            onClick={() => setIsModalOpen(true)}
          >
            + Book a Service
          </button>
        )}
      </div>

      <BookingTable isAdmin={isAdmin} userId={user?.uid} />

      {!isAdmin && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <BookingForm
            onClose={() => setIsModalOpen(false)}
            userId={user?.uid}
          />
        </Modal>
      )}
    </div>
  );
};

export default BookingsPage;
