import { useState, useRef, useEffect } from "react";

const CustomSelect: React.FC<{
  options: string[];
  value: string;
  className?: string;
  onChange: (value: string) => void;
}> = ({ options, value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        className={`min-w-[100px] max-w-full truncate px-4 py-3 theme-border rounded-md text-theme focus:outline-none focus:ring-2 transition-all text-left ${className}`}
        onClick={toggleDropdown}
      >
        {value}
        <span className="ml-2">&#9662;</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 w-full mt-2 rounded-md shadow-lg bg-surface z-10">
          <ul className="py-1">
            {options.map((option) => (
              <li
                key={option}
                className="px-4 py-2 cursor-pointer bg-primary-hover text-theme transition-all truncate"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
