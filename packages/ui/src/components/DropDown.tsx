"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Slot } from "@radix-ui/react-slot";
import { Button } from "./Button";
import { cn } from "../lib/utils";

type DropdownSide = "top" | "bottom";
type DropdownAlign = "start" | "center" | "end";

type DropdownContextValue = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
};
const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const ctx = useContext(DropdownContext);
  if (!ctx)
    throw new Error("Dropdown components must be used inside <Dropdown>.");
  return ctx;
}

type MenuPositionInput = {
  triggerRect: DOMRect;
  menuWidth: number;
  menuHeight: number;
  side: DropdownSide;
  align: DropdownAlign;
  sideOffset: number;
  viewportWidth: number;
  viewportHeight: number;
  padding?: number;
  alignOffset: number;
};
type MenuPosition = { top: number; left: number; side: DropdownSide };

function computeMenuPosition({
  triggerRect,
  menuWidth,
  menuHeight,
  side,
  align,
  sideOffset,
  viewportWidth,
  viewportHeight,
  padding = 8,
  alignOffset,
}: MenuPositionInput): MenuPosition {
  let actualSide = side;
  if (
    side === "bottom" &&
    triggerRect.bottom + sideOffset + menuHeight > viewportHeight
  )
    actualSide = "top";
  if (side === "top" && triggerRect.top - sideOffset - menuHeight < 0)
    actualSide = "bottom";

  const top =
    actualSide === "bottom"
      ? triggerRect.bottom + sideOffset
      : triggerRect.top - menuHeight - sideOffset;
  const left =
    align === "center"
      ? triggerRect.left + triggerRect.width / 2 - menuWidth / 2 + alignOffset
      : align === "end"
        ? triggerRect.right - menuWidth + alignOffset
        : triggerRect.left + alignOffset;

  return {
    top: Math.min(
      Math.max(top, padding),
      viewportHeight - menuHeight - padding,
    ),
    left: Math.min(
      Math.max(left, padding),
      viewportWidth - menuWidth - padding,
    ),
    side: actualSide,
  };
}

const originFor = (side: DropdownSide, align: DropdownAlign) =>
  side === "bottom"
    ? align === "start"
      ? "top left"
      : align === "end"
        ? "top right"
        : "top center"
    : align === "start"
      ? "bottom left"
      : align === "end"
        ? "bottom right"
        : "bottom center";

// ---------- Dropdown ----------

type DropdownProps = { children: ReactNode; defaultOpen?: boolean };

export function Dropdown({ children, defaultOpen = false }: DropdownProps) {
  const [open, setOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        contentRef.current?.contains(target)
      )
        return;
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef, contentRef }}>
      {children}
    </DropdownContext.Provider>
  );
}

// ---------- Trigger ----------

type DropdownTriggerProps = { children: ReactNode; asChild?: boolean };

export function DropdownTrigger({
  children,
  asChild = false,
}: DropdownTriggerProps) {
  const { open, setOpen, triggerRef } = useDropdownContext();
  const toggle = () =>
    requestAnimationFrame(() => {
      setOpen((p) => !p);
    });

  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={triggerRef as never}
      type={asChild ? undefined : "button"}
      aria-haspopup="menu"
      aria-expanded={open}
      onClick={toggle}
    >
      {children}
    </Comp>
  );
}

// ---------- Content ----------

type DropdownContentProps = {
  children: ReactNode;
  className?: string;
  side?: DropdownSide;
  align?: DropdownAlign;
  sideOffset?: number;
  alignOffset?: number;
};

export function DropdownContent({
  children,
  className,
  side = "bottom",
  align = "start",
  sideOffset = 8,
  alignOffset = 0,
}: DropdownContentProps) {
  const reducedMotion = useReducedMotion();
  const { open, contentRef, triggerRef } = useDropdownContext();
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const trigger = triggerRef.current,
        content = contentRef.current;
      if (!trigger || !content) return;
      const {
        top,
        left,
        side: actualSide,
      } = computeMenuPosition({
        triggerRect: trigger.getBoundingClientRect(),
        menuWidth: content.offsetWidth,
        menuHeight: content.offsetHeight,
        side,
        align,
        sideOffset,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        alignOffset,
      });
      setStyle({
        position: "fixed",
        top,
        left,
        zIndex: 1200,
        transformOrigin: originFor(actualSide, align),
      });
    };
    update();
    const ro = new ResizeObserver(update);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, side, align, sideOffset, triggerRef, contentRef]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() =>
      contentRef.current
        ?.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)')
        ?.focus(),
    );
    return () => cancelAnimationFrame(id);
  }, [open, contentRef]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const items = Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not(:disabled)',
      ) ?? [],
    );
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      (document.activeElement as HTMLElement)?.click();
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          role="menu"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          style={style}
          className={cn(
            "min-w-52 overflow-hidden border border-border bg-surface shadow-lg squircle-xl",
            className,
          )}
          initial={
            reducedMotion
              ? { opacity: 1 }
              : { opacity: 0, y: -4, scale: 0.98, filter: "blur(4px)" }
          }
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={
            reducedMotion
              ? { opacity: 1 }
              : { opacity: 0, y: -4, scale: 0.98, filter: "blur(2px)" }
          }
          transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ---------- Item / Separator ----------

type DropdownItemProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  destructive?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
};

export function DropdownItem({
  children,
  className,
  disabled = false,
  destructive = false,
  icon,
  onClick,
}: DropdownItemProps) {
  const { setOpen, triggerRef } = useDropdownContext();

  return (
    <Button
      variant="ghost"
      role="menuitem"
      tabIndex={-1}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onClick?.();
        setOpen(false);
        requestAnimationFrame(() => {
          triggerRef.current?.focus();
        });
      }}
      className={cn(
        "h-9 w-full justify-start gap-2 border-0 bg-transparent px-3 shadow-none rounded-none hover:bg-surface-strong/70 hover:text-foreground focus-visible:bg-surface-strong/70 focus-visible:text-foreground focus-visible:ring-0 focus-visible:ring-transparent focus-visible:border-transparent focus-visible:outline-none",
        destructive &&
          "text-destructive hover:bg-destructive/10 hover:text-destructive",
        className,
      )}
    >
      {icon}
      {children}
    </Button>
  );
}

type DropdownSeparatorProps = { className?: string };

export function DropdownSeparator({ className }: DropdownSeparatorProps) {
  return (
    <div role="separator" className={cn("my-1 h-px bg-border", className)} />
  );
}