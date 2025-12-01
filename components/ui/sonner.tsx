"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const PASTEL_COLORS = {
  success: {
    bg: "#E6F4EA",
    text: "#1B5E20",
    border: "#C8E6C9",
    description: "#000",
  },
  error: {
    bg: "#FCE8E6",
    text: "#B71C1C",
    border: "#F5C2C0",
  },
  warning: {
    bg: "#FFF7E0",
    text: "#8A6D1A",
    border: "#FCE8A3",
  },
  info: {
    bg: "#E6F2FA",
    text: "#0B4F71",
    border: "#B8DEEF",
  },
};

const Toaster = (props: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <>
      <Sonner
        {...props}
        theme={theme as ToasterProps["theme"]}
        className="pastel-toaster"
        icons={{
          success: <CircleCheckIcon className="size-4" />,
          info: <InfoIcon className="size-4" />,
          warning: <TriangleAlertIcon className="size-4" />,
          error: <OctagonXIcon className="size-4" />,
          loading: <Loader2Icon className="size-4 animate-spin" />,
        }}
        style={
          {
            "--success-bg": PASTEL_COLORS.success.bg,
            "--success-text": PASTEL_COLORS.success.text,
            "--success-border": PASTEL_COLORS.success.border,

            "--error-bg": PASTEL_COLORS.error.bg,
            "--error-text": PASTEL_COLORS.error.text,
            "--error-border": PASTEL_COLORS.error.border,

            "--warning-bg": PASTEL_COLORS.warning.bg,
            "--warning-text": PASTEL_COLORS.warning.text,
            "--warning-border": PASTEL_COLORS.warning.border,

            "--info-bg": PASTEL_COLORS.info.bg,
            "--info-text": PASTEL_COLORS.info.text,
            "--info-border": PASTEL_COLORS.info.border,

            "--border-radius": "var(--radius)",
          } as React.CSSProperties
        }
      />

      <style jsx global>{`
        /* Generic styling */
        .pastel-toaster [data-type] {
          border-width: 1px !important;
        }
        .pastel-toaster [data-description] {
          color: #000 !important;
        }  

        /* SUCCESS */
        .pastel-toaster [data-type="success"] {
          background: var(--success-bg) !important;
          color: var(--success-text) !important;
          border-color: var(--success-border) !important;
        }
        .pastel-toaster [data-type="success"] [data-description] {
          color: ${PASTEL_COLORS.success.description} !important;
        }

        /* ERROR */
        .pastel-toaster [data-type="error"] {
          background: var(--error-bg) !important;
          color: var(--error-text) !important;
          border-color: var(--error-border) !important;
        }

        /* WARNING */
        .pastel-toaster [data-type="warning"] {
          background: var(--warning-bg) !important;
          color: var(--warning-text) !important;
          border-color: var(--warning-border) !important;
        }

        /* INFO */
        .pastel-toaster [data-type="info"] {
          background: var(--info-bg) !important;
          color: var(--info-text) !important;
          border-color: var(--info-border) !important;
        }

        /* Icons match text */
        .pastel-toaster [data-type] svg {
          color: inherit !important;
        }
      `}</style>
    </>
  );
};

export { Toaster };
