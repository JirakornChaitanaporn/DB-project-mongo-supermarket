import "./dropdown.css"
import React, { useState, useEffect } from "react";

interface DropdownButtonProps {
  defaultLabel: string;
  options: string[];
  onSelect?: (value: string) => void;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ defaultLabel, options, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false);
    if (onSelect) onSelect(option);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-button")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="dropdown-button">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="my-button"
      >
        {selected || defaultLabel}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="dropdown-menu">
          <ul className="text">
            {options.map((option) => (
              <li key={option}>
                <button
                  onClick={() => handleSelect(option)}
                  className="dropdown-item"
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
