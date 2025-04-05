import React from "react";

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  placeholder: string;
  error?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ id, placeholder, error, value, ...rest }, ref) => {
    const isActive = value || rest.defaultValue;

    return (
      <div className="relative">
        <input
          id={id}
          ref={ref}
          className={`peer p-3 pt-5 rounded-md w-full theme-border 
            text-theme focus:ring-2 bg-theme
            focus:ring-[var(--diagram-color1)] outline-none ${
              error ? "border-red-500" : ""
            }`}
          value={value}
          {...rest}
        />
        <label
          htmlFor={id}
          className={`absolute left-3 text-secondary text-sm transition-all ${
            isActive
              ? "top-2 text-primary"
              : "top-5 text-secondary peer-placeholder-shown:top-5"
          }`}
        >
          {placeholder}
        </label>
        {error && (
          <span className="text-sm text-red-500 mt-1 block">{error}</span>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
