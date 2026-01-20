interface FormButtonProps {
  loading: boolean;
  text: string;
  type: "button" | "submit" | "reset";
  disabled: boolean;
}

export default function FormButton({
  loading,
  text,
  type,
  disabled,
}: FormButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="primary-btn h-10 disabled:bg-neutral-400  disabled:text-neutral-300 disabled:cursor-not-allowed w-full"
    >
      {loading ? "로딩 중" : text}
    </button>
  );
}
