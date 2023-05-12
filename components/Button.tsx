import clsxm from "@/lib/clsxm";

interface IButtonProps {
  label: string;
  className?: string;
}

const Button: React.FC<IButtonProps> = ({ label, className }) => {
  return (
    <button
      className={clsxm(
        "px-10 py-5 select-none focus:outline-none rounded-xl bg-primary text-2xl cursor-pointer text-black",
        className
      )}
    >
      {label}
    </button>
  );
};

export default Button;
