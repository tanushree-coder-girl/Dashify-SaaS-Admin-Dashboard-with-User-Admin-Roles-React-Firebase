// @components/PrimaryButton.tsx
import React from "react";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

const PrimaryButton = ({ children, onClick, type = "button", className = "" }: PrimaryButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`w-full py-3 rounded bg-primary text-theme font-semibold font-poppins transition-all hover:opacity-80 ${className}`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
