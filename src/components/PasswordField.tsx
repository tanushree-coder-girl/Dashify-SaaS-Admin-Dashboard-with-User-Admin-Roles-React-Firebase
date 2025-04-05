import React from "react";
import InputField from "./InputFieldWithFloatingLabel";

interface PasswordFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  placeholder: string;
  value: string;
  error?: string;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    { id, placeholder, value, error, showPassword, setShowPassword, ...rest },
    ref
  ) => {
    return (
      <div className="relative">
        <InputField
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          error={error}
          ref={ref}
          {...rest}
        />
        <button
          type="button"
          className="absolute right-3 top-4 text-secondary"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";
export default PasswordField;
