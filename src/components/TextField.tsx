export interface InputFieldProps {
  id: string;
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register?: any;
  border?: boolean;
  disabled?: boolean;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  register,
  border = true,
  disabled = false,
  className,
}) => {
  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        {...(register ? register(id) : {})}
        className={`p-3 rounded-md w-full bg-surface text-theme focus:ring-2 outline-none ${
          border ? "theme-border" : ""
        } ${className}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default InputField;
