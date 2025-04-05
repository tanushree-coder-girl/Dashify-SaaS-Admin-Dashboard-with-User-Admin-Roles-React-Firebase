import { useState } from "react";
import InputField from "@/components/TextField";
import { updatePaymentStatus } from "@services/paymentsApi";
import { useQueryClient } from "@tanstack/react-query"; // ✅ Yeh import karo

interface PaymentFormProps {
  paymentId: string | null;
  onClose: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ paymentId, onClose }) => {
  const [cardNumber, setCardNumber] = useState("");
  const queryClient = useQueryClient(); // ✅ Query Client initialize karo

  const handleProceed = async () => {
    if (!paymentId) return;

    try {
      await updatePaymentStatus(paymentId); // ✅ Payment status update karega Firestore mein
      console.log(`Payment successful for ID: ${paymentId}`);

      queryClient.invalidateQueries({ queryKey: ["payments"] }); // ✅ Yeh payments table ko refresh karega
      onClose(); // ✅ Modal ko close karega
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

      <button
        onClick={handleProceed}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
      >
        Proceed
      </button>
    </div>
  );
};

export default PaymentForm;
