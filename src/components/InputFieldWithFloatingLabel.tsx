export interface InputFieldProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  type,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        className="peer p-3 pt-5 rounded-md w-full theme-border 
                      text-theme focus:ring-2 bg-theme
                     focus:ring-[var(--diagram-color1)] outline-none"
        value={value}
        onChange={onChange}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 text-secondary text-sm transition-all ${
          value
            ? "top-2 text-primary"
            : "top-5 text-secondary peer-placeholder-shown:top-5"
        }`}
      >
        {placeholder}
      </label>
    </div>
  );
};

export default InputField;
