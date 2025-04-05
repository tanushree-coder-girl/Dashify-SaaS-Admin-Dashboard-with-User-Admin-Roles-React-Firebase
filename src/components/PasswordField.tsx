import InputField from "./InputFieldWithFloatingLabel";

interface PasswordFieldProps {
  id: string;
  placeholder: string;
  value: string;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  placeholder,
  value,
  showPassword,
  setShowPassword,
  onChange,
}) => {
  return (
    <div className="relative">
      <InputField
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
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
};

export default PasswordField;
