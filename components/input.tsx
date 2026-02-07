import { forwardRef } from "react";

interface InputProps {
  name: string;
  errors?: string[];
  hideErrors?: boolean;
  containerClassName?: string;
}

const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & InputProps
>(function FormInput(
  { name, errors = [], hideErrors = false, containerClassName, ...rest },
  ref,
) {
  return (
    <div
      className={`relative flex flex-col gap-2 mb-4 ${containerClassName ?? ""}`}
    >
      <input
        ref={ref}
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border placeholder:text-neutral-400 px-3 py-2 text-base "
        name={name}
        {...rest}
      />
      {!hideErrors && (
        <div className="absolute left-0 right-0 top-full mt-1">
          {errors.map((error, index) => (
            <span key={index} className="block text-red-500 font-medium">
              {error === "" ? "\u00A0" : error}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
