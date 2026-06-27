type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

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

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="min-h-[220px] w-full resize-none rounded-3xl border border-purple/18 bg-white/75 p-4 text-sm text-purple outline-none transition placeholder:text-purple/45 focus:border-purple focus:ring-4 focus:ring-yellow/35"
      {...props}
    />
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full rounded-2xl border border-purple/18 bg-white/75 px-4 py-3 text-sm text-purple outline-none transition placeholder:text-purple/45 focus:border-purple focus:ring-4 focus:ring-yellow/35"
      {...props}
    />
  );
}
