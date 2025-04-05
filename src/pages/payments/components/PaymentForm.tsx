import { useState } from "react";
import InputField from "@/components/TextField";
import { updatePaymentStatus } from "@services/paymentsApi";
import { useQueryClient } from "@tanstack/react-query";
import PrimaryButton from "@/components/PrimaryButton";
import { toast } from "react-toastify";

interface PaymentFormProps {
  paymentId: string | null;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ paymentId, onClose }) => {
  const [cardNumber, setCardNumber] = useState("");
  const queryClient = useQueryClient();

  const handleProceed = async () => {
    if (!cardNumber) return toast.error("Please fill card number");
    if (!paymentId) return;

    try {
      await updatePaymentStatus(paymentId);
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      onClose();
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-3">Enter Payment Details</h2>
      <InputField
        id="cardNumber"
        type="text"
        placeholder="Enter Bank/Card Details"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
      />

      <PrimaryButton onClick={handleProceed} className="mt-4 w-full">
        Proceed
      </PrimaryButton>
    </div>
  );
};

export default PaymentForm;
