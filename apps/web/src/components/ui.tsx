type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export const formControlClass =
  "w-full border border-[rgba(93,84,145,0.18)] bg-[rgba(255,255,255,0.72)] text-sm text-purple outline-none transition placeholder:text-[rgba(93,84,145,0.55)] focus:border-purple focus:ring-4 focus:ring-yellow/40";

const buttonVariants = {
  primary: "bg-yellow text-purple shadow-[0_10px_24px_rgba(255,210,48,0.28)] hover:brightness-105",
  secondary: "bg-purple text-white hover:brightness-110",
  ghost: "border border-purple/18 bg-white/55 text-purple hover:border-purple/35 hover:bg-neon",
  danger: "bg-yellow text-purple hover:brightness-105",
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-2xl px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  );
}

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-[30px] border border-white/70 bg-white/72 text-purple shadow-glow backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

export function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-[220px] resize-none rounded-3xl p-4 ${formControlClass} ${className}`}
      {...props}
    />
  );
}

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`rounded-2xl px-4 py-3 ${formControlClass} ${className}`}
      {...props}
    />
  );
}
