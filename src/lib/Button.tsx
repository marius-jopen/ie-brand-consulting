import { FC, ReactNode } from "react";
import { PrismicNextLink } from "@prismicio/next";
import { LinkField } from "@prismicio/client";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  field?: LinkField;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
}

const Button: FC<ButtonProps> = ({ 
  children, 
  className = "", 
  field, 
  onClick, 
  type = "button",
  variant = "primary" 
}) => {
  const baseClasses = "px-6 py-2 transition-colors duration-200 ease-in-out";
  
  const variantClasses = {
    primary: "bg-black text-white hover:bg-[#F0F0F0] hover:text-black",
    secondary: "bg-[#F0F0F0] text-black hover:bg-black hover:text-white"
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (field) {
    return (
      <PrismicNextLink className={combinedClasses} field={field}>
        {children}
      </PrismicNextLink>
    );
  }

  return (
    <button 
      className={combinedClasses} 
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
