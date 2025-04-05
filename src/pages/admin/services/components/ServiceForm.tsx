import { useState } from "react";
import { useForm, UseFormRegister } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addService, updateService } from "@services/servicesApi";
import InputField from "@/components/TextField";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

// ✅ Define Form Data Type
interface ServiceFormData {
  title: string;
  category: string;
  price: number;
}

// ✅ Define Props Type
interface ServiceFormProps {
  onClose: () => void;
  initialData?: {
    id: string;
    title: string;
    category: string;
    price: number;
  } | null;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ onClose, initialData }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<ServiceFormData>({
    defaultValues: initialData || { title: "", category: "", price: 0 },
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Loader State

  // ✅ Mutation for Adding Service
  const addMutation = useMutation({
    mutationFn: addService,
    onMutate: () => setIsSubmitting(true), // Show loader
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      reset();
      onClose();
    },
    onSettled: () => setIsSubmitting(false), // Hide loader
  });

  // ✅ Mutation for Updating Service
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceFormData }) =>
      updateService(id, data),
    onMutate: () => setIsSubmitting(true), // Show loader
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      reset();
      onClose();
    },
    onSettled: () => setIsSubmitting(false), // Hide loader
  });

  const onSubmit = (data: ServiceFormData) => {
    if (!data.title || !data.category || !data.price) {
      toast.error("All fields are required!");
      return;
    }

    if (initialData) {
      updateMutation.mutate({ id: initialData.id, data }); // Edit Service
    } else {
      addMutation.mutate(data); // Add New Service
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        id="title"
        type="text"
        placeholder="Enter service name"
        register={register as unknown as UseFormRegister<any>} // 🛠 Fix register type issue
      />
      <InputField
        id="category"
        type="text"
        placeholder="Enter category"
        register={register as unknown as UseFormRegister<any>} // 🛠 Fix register type issue
      />
      <InputField
        id="price"
        type="number"
        placeholder="Enter price"
        register={register as unknown as UseFormRegister<any>} // 🛠 Fix register type issue
      />

      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded-md w-full hover:bg-primary-dark transition flex justify-center items-center"
        disabled={isSubmitting} // Disable button while submitting
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <FaSpinner className="animate-spin mr-2" />
            Processing...
          </span>
        ) : initialData ? (
          "Update Service"
        ) : (
          "Add Service"
        )}
      </button>
    </form>
  );
};

export default ServiceForm;
