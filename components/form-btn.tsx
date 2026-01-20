interface FormButtonProps {
  loading: boolean;
  text: string;
  type: "button" | "submit" | "reset";
  disabled: boolean;
  className?: string;
}

export default function FormButton({
  loading,
  text,
  type,
  disabled,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & FormButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`primary-btn h-10 disabled:bg-neutral-400  disabled:text-neutral-300 disabled:cursor-not-allowed w-full ${className}`}
      {...props}
    >
      {loading ? "로딩 중" : text}
    </button>
  );
}
