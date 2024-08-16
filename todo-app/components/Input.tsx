"use client";

import { UseFormRegister } from "react-hook-form";

export const Input = ({
  label,
  placeholder,
  register,
  name,
  type = "text",
}: {
  label: string;
  placeholder: string;
  register: UseFormRegister<any>;
  name: string;
  type?: "text" | "password";
}) => {
  return (
    <div>
      <div className="text-sm pb-1 pt-2">
        * <label>{label}</label>
      </div>
      <input
        className="border rounded px-4 py-2 w-full border-black"
        type={type}
        placeholder={placeholder}
        {...register(name)}
      />
    </div>
  );
};
