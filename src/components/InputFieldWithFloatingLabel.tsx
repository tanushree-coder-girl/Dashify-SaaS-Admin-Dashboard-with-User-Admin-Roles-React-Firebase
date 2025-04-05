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
        className="peer p-3 pt-5 border rounded-md w-full border-[var(--secondary-color)] 
                     bg-[var(--input-bg)] text-theme focus:ring-2 
                     focus:ring-[var(--primary-color)] outline-none"
        value={value}
        onChange={onChange}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 text-gray-400 text-sm transition-all ${
          value
            ? "top-2 text-[var(--primary-color)]"
            : "top-5 text-base peer-placeholder-shown:top-5"
        }`}
      >
        {placeholder}
      </label>
    </div>
  );
};

export default InputField;
