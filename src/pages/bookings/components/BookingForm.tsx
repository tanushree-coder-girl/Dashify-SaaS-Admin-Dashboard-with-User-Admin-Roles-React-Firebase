import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addBooking } from "@services/bookingsApi";
import CustomSelect from "@components/CustomSelect";
import { fetchServices } from "@services/servicesApi";
import PrimaryButton from "@/components/PrimaryButton";
import { toast } from "react-toastify";

interface BookingFormProps {
  onClose: () => void;
  userId?: string | number;
}

interface Service {
  id: string;
  title: string;
  category: string;
  price: number;
}

const BookingForm: React.FC<BookingFormProps> = ({ onClose, userId }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const queryClient = useQueryClient();

  const { data: services = [] } = useQuery<any[], Error>({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const bookingMutation = useMutation({
    mutationFn: async () => {
      if (!selectedService) return;
      await addBooking({
        userId,
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        category: selectedService.category,
        price: selectedService.price,
        status: "Pending",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
    },
  });

  const handleBookService = () => {
    if (!selectedService) return toast.error("Select service to book");
    bookingMutation.mutate();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-center">Book a Service</h2>

      <CustomSelect
        options={services.map((service) => service.title)}
        value={selectedService?.title || "Book Your Service Now"}
        onChange={(title) =>
          setSelectedService(
            services.find((service) => service.title === title) || null
          )
        }
        className="min-w-full w-full mb-2"
      />

      <PrimaryButton
        onClick={handleBookService}
        type="button"
        disabled={bookingMutation?.isPending}
      >
        {bookingMutation?.isPending ? "Processing.." : "Book Now"}
      </PrimaryButton>
    </div>
  );
};

export default BookingForm;
