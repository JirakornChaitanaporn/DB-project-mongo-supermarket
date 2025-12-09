import "./dropdown.css"
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

interface DropdownButtonProps {
  defaultLabel: string; // initial label
  options: string[];    // list of topics
  onSelect?: (value: string) => void; // optional callback
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ defaultLabel, options, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false);
    if (onSelect) onSelect(option);
  };

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
