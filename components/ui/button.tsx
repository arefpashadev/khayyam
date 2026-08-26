import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "border-transparent bg-[#0799ef] text-white shadow-sm hover:bg-[#0789d6] focus-visible:ring-[#0799ef]/35",
  outline:
    "border-[#45515a] bg-transparent text-[#111827] hover:bg-white/45 focus-visible:ring-[#45515a]/25",
  ghost:
    "border-transparent bg-transparent text-[#111827] hover:bg-black/5 focus-visible:ring-black/15",
} as const;

const sizes = {
  sm: "h-9 gap-1.5 rounded-md px-4 text-sm",
  md: "h-11 gap-2 rounded-lg px-5 text-base",
  lg: "h-12 gap-2.5 rounded-lg px-7 text-lg",
  icon: "size-11 rounded-lg p-0",
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

type CommonProps = {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

type NativeButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: never;
  };

type AnchorButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

export type ButtonProps = NativeButtonProps | AnchorButtonProps;

export const Button = ({
  children,
  className,
  fullWidth = false,
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps) => {
  const classes = cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center border font-medium transition-[color,background-color,border-color,box-shadow,transform] outline-none active:scale-[0.97] focus-visible:ring-4 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );

  if ("href" in props && typeof props.href === "string") {
    const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };

    return (
      <a {...anchorProps} className={classes}>
        {children}
      </a>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type="button" {...buttonProps} className={classes}>
      {children}
    </button>
  );
};

export { sizes as buttonSizes, variants as buttonVariants };
