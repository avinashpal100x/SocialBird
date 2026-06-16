import { Toaster as Sonner } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = (props) => {
  return (
    <Sonner
      position="bottom-right"
      theme="light"
      closeButton
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        style: {
          background: "#ffffff",
          color: "#111827",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };