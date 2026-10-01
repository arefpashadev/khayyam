"use client";

import { Menu, X } from "lucide-react";
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal, flushSync } from "react-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MenuItem {
  href?: string;
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
}

interface HamburgerMenuOverlayProps {
  ariaLabel?: string;
  animationDuration?: number;
  buttonClassName?: string;
  buttonSize?: "sm" | "md" | "lg";
  className?: string;
  customButton?: ReactNode;
  items: MenuItem[];
  keepOpenOnItemClick?: boolean;
  menuItemClassName?: string;
  onClose?: () => void;
  onOpen?: () => void;
  overlayBackground?: string;
  staggerDelay?: number;
  textColor?: string;
  zIndex?: number;
}

const emptySubscribe = () => () => undefined;

export const HamburgerMenuOverlay = ({
  ariaLabel = "منوی اصلی",
  animationDuration = 0.8,
  buttonClassName,
  buttonSize = "md",
  className,
  customButton,
  items,
  keepOpenOnItemClick = false,
  menuItemClassName,
  onClose,
  onOpen,
  overlayBackground = "linear-gradient(145deg, #0799ef 0%, #0479c2 100%)",
  staggerDelay = 0.08,
  textColor = "#ffffff",
  zIndex = 1000,
}: HamburgerMenuOverlayProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const buttonSizes = {
    sm: "size-10",
    md: "size-11",
    lg: "size-12",
  };

  const setOpen = (open: boolean) => {
    if (open) {
      const rect = triggerRef.current?.getBoundingClientRect();
      const overlayElement = overlayRef.current;

      if (rect) {
        flushSync(() => {
          setOrigin({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          });
        });
      }

      if (overlayElement) {
        overlayElement.getBoundingClientRect();
      }
      onOpen?.();
      requestAnimationFrame(() => setIsOpen(true));
      return;
    }

    onClose?.();
    setIsOpen(false);
  };

  const handleItemClick = (item: MenuItem) => {
    item.onClick?.();
    if (!keepOpenOnItemClick) setOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const overlay = (
    <div
      ref={overlayRef}
      id="navigation-menu"
      aria-hidden={!isOpen}
      className={cn(
        "fixed inset-0 flex items-center justify-center overflow-hidden",
        !isOpen && "pointer-events-none",
      )}
      style={{
        background: overlayBackground,
        clipPath: isOpen
          ? `circle(150vmax at ${origin.x}px ${origin.y}px)`
          : `circle(0px at ${origin.x}px ${origin.y}px)`,
        transition: `clip-path ${animationDuration}s cubic-bezier(0.22, 1, 0.36, 1)`,
        zIndex,
      }}
    >
      <nav aria-label={ariaLabel} className="w-full max-w-md px-8">
        <ul className="flex flex-col items-stretch gap-2">
          {items.map((item, index) => (
            <li
              key={`${item.label}-${item.href ?? index}`}
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateX(0)" : "translateX(80px)",
                transition: `opacity 350ms ease ${index * staggerDelay}s, transform 350ms ease ${index * staggerDelay}s`,
              }}
            >
              {item.href ? (
                <a
                  href={item.href}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-xl px-5 py-3 text-start text-2xl font-semibold transition-colors hover:bg-white/15 sm:text-3xl",
                    menuItemClassName,
                  )}
                  style={{ color: textColor }}
                >
                  <span>{item.label}</span>
                  {item.icon}
                  <span className="h-1 w-0 rounded-full bg-current transition-[width] duration-300 group-hover:w-10" />
                </a>
              ) : (
                <Button
                  fullWidth
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "h-auto justify-between border-0 bg-transparent px-5 py-3 text-start text-2xl shadow-none hover:bg-white/15 sm:text-3xl",
                    menuItemClassName,
                  )}
                  variant="ghost"
                >
                  <span>{item.label}</span>
                  {item.icon}
                </Button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  return (
    <span
      ref={triggerRef}
      className={cn("relative inline-flex", className)}
      style={{ zIndex: zIndex + 1 }}
    >
      <Button
        aria-controls="navigation-menu"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={cn(
          "relative rounded-lg p-0 shadow-none",
          buttonSizes[buttonSize],
          isOpen
            ? "border-transparent bg-[#0799ef] text-white hover:bg-[#0789d6]"
            : "bg-transparent text-[#111827] hover:bg-white/45",
          buttonClassName,
        )}
        onClick={() => setOpen(!isOpen)}
        size="icon"
        variant="outline"
      >
        {customButton ?? (
          <>
            <Menu
              aria-hidden="true"
              className={cn(
                "absolute transition-all duration-300",
                isOpen
                  ? "rotate-45 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100",
              )}
              size={22}
            />
            <X
              aria-hidden="true"
              className={cn(
                "absolute transition-all duration-300",
                isOpen
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-45 scale-0 opacity-0",
              )}
              size={22}
            />
          </>
        )}
      </Button>

      {isClient && createPortal(overlay, document.body)}
    </span>
  );
};
