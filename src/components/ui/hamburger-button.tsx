"use client";

interface HamburgerButtonProps {
  onClick: () => void;
  className?: string;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`md:hidden bg-white shadow-lg rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:shadow-xl ${className}`}
      aria-label="Toggle menu"
    >
      <div className="text-xl">🍔</div>
    </button>
  );
};

export default HamburgerButton;
