import {
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { Button } from "./Button";
import { cn } from "../lib/utils";

type ModalSize = "sm" | "md" | "lg";

const sizeStyles: Record<ModalSize, CSSProperties> = {
  sm: { width: 448, maxWidth: "calc(100vw - 2rem)" },
  md: { width: 576, maxWidth: "calc(100vw - 2rem)" },
  lg: { width: 768, maxWidth: "calc(100vw - 2rem)" },
};

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  width?: number | string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  bodyClassName?: string;
  footerClassName?: string;
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  width,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className,
  bodyClassName,
  footerClassName,
}: ModalProps) {
  const reducedMotion = useReducedMotion();

  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  const canUseDom =
    typeof window !== "undefined" && typeof document !== "undefined";

  useEffect(() => {
    if (!open || !canUseDom) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, canUseDom]);

  useEffect(() => {
    if (!open || !closeOnEscape || !canUseDom) return;

    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [open, closeOnEscape, onOpenChange, canUseDom]);

  useEffect(() => {
    if (!open || !closeOnBackdrop || !canUseDom) return;

    const listener = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [open, closeOnBackdrop, onOpenChange, canUseDom]);

  if (!canUseDom) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1200] grid place-items-center p-6"
          style={{ backgroundColor: "rgb(0 0 0 / 0.25)" }}
          initial={
            reducedMotion
              ? { opacity: 1 }
              : { opacity: 0, backdropFilter: "blur(0px)" }
          }
          animate={{
            opacity: 1,
            backdropFilter: "blur(6px)",
          }}
          exit={{
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
          transition={{
            duration: 0.16,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            style={
              width
                ? { width, maxWidth: "calc(100vw - 2rem)" }
                : sizeStyles[size]
            }
            className={cn(
              "flex w-full max-h-[calc(100dvh-3rem)] flex-col overflow-hidden squircle-2xl squircle-amt-2.5 border border-border bg-surface text-foreground shadow-modal",
              className,
            )}
            initial={
              reducedMotion
                ? { opacity: 1 }
                : {
                    opacity: 0,
                    scale: 0.97,
                    y: 12,
                    filter: "blur(4px)",
                  }
            }
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={
              reducedMotion
                ? { opacity: 1 }
                : {
                    opacity: 0,
                    scale: 0.985,
                    y: 8,
                    filter: "blur(2px)",
                  }
            }
            transition={{
              duration: 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <header className="flex items-start justify-between gap-md border-b border-border px-xl py-lg">
              <div className="min-w-0">
                <h2 id={titleId} className="text-title text-foreground">
                  {title}
                </h2>

                {description && (
                  <p
                    id={descriptionId}
                    className="mt-xs text-body-sm text-muted-foreground"
                  >
                    {description}
                  </p>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Close dialog"
                onClick={() => onOpenChange(false)}
                className="
                  -mr-xs -mt-xs
                  squircle-lg
                  bg-muted/60
                  text-muted-foreground
                  hover:bg-muted
                  hover:text-foreground
                  border border-border/60
                  backdrop-blur-sm
                  transition-all"
              >
                <X className="size-4" />
              </Button>
            </header>

            <div
              className={cn(
                "flex-1 overflow-y-auto px-xl py-lg",
                bodyClassName,
              )}
            >
              {children}
            </div>

            {footer && (
              <footer
                className={cn(
                  "flex items-center justify-end gap-sm border-t border-border bg-surface-strong/40 px-xl py-lg",
                  footerClassName,
                )}
              >
                {footer}
              </footer>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}