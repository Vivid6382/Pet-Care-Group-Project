'use client'
import React, { ReactNode } from 'react'; // Import ReactNode from 'react'

interface BlueButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const BlueButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
}: BlueButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`block mx-auto w-1/2 font-bold text-2xl text-white bg-blue-500 rounded-full border-4 border-black p-3 text-center transition-all duration-200
        hover:bg-white hover:text-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
};

export default BlueButton;