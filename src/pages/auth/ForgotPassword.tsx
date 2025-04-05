import { useState } from "react";
import InputField from "@/components/InputFieldWithFloatingLabel";
import { useAuth } from "@context/AuthContext";
import PrimaryButton from "@/components/PrimaryButton";

const ForgotPassword = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { resetPassword } = useAuth();

  const handleForgotPassword = () => {
    if (!email) {
      setMessage("⚠️ Please enter your email.");
      return;
    }
    console.log("Sending reset link to:", email);
    resetPassword(email);
    setMessage("✅ If this email is registered, a reset link has been sent.");
  };

  return (
    <div className="w-full p-6 bg-surface rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-theme font-poppins text-center">
        Forgot Password
      </h2>
      <p className="text-sm text-secondary text-center font-inter mt-2">
        Enter your email below and we’ll send you a reset link.
      </p>

      <div className="mt-4">
        <InputField
          id="email"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
        />
      </div>

      {message && (
        <p className="text-sm mt-2 text-theme font-inter">{message}</p>
      )}

      <PrimaryButton onClick={handleForgotPassword} className="mt-4">
        Send Reset Link
      </PrimaryButton>

      <p className="mt-4 text-center text-sm font-inter">
        Remember your password?{" "}
        <button onClick={onClose} className="text-primary hover:underline">
          Login
        </button>
      </p>
    </div>
  );
};

export default ForgotPassword;
