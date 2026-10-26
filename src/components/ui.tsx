"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { motion, MotionConfig } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Check, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const ToastContext = createContext<(message: string) => void>(() => {});
export const useToast = () => useContext(ToastContext);
export function Providers({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState("");
  const show = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(
      () => setToast((value) => (value === message ? "" : value)),
      3000,
    );
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <ToastContext.Provider value={show}>
        {children}
        <div
          className={`toast ${toast ? "toast-visible" : ""}`}
          role="status"
          aria-live="polite"
        >
          {toast && (
            <>
              <Check size={17} />
              {toast}
            </>
          )}
        </div>
      </ToastContext.Provider>
    </MotionConfig>
  );
}
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`reveal ${className}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
}
export function Drawer({
  trigger,
  title,
  children,
  open,
  onOpenChange,
  onCloseAutoFocus,
  className,
}: {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCloseAutoFocus?: (event: Event) => void;
  className?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="drawer-overlay" />
        <Dialog.Content className={`drawer${className ? ` ${className}` : ""}`} onCloseAutoFocus={onCloseAutoFocus}>
          <div className="drawer-title">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close className="icon-button" aria-label="关闭面板">
              <X size={21} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            {title}，按 Escape 关闭面板。
          </Dialog.Description>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  description,
  href,
  linkText = "查看全部",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {linkText}
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
export function EmptyState({
  icon,
  title,
  description,
  children,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      {icon}
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
}
