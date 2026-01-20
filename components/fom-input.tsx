interface FormInputProps {
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
  errors?: string[];
}

export default function FormInput({
  name,
  type,
  placeholder,
  required,
  errors = [],
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & FormInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-[#e35b2f]/40 border placeholder:text-neutral-400 px-3 py-2 text-base "
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        {...props}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
