"use client";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';

import { toast, useToasts } from "./use-toast";

const containerStyles = {
  success: "bg-green-100 border text-green-900 border-green-500",
  info: "bg-purple-100 border text-purple-950 border-purple-500",
  error: "bg-red-100 border text-red-900 border-red-500",
};

const icons = {
  success: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
  info: <InfoIcon className="w-5 h-5 text-purple-600" />,
  error: <WarningIcon className="w-5 h-5 text-red-600" />,
};

export function Toaster() {
  const toasts = useToasts();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-99999">
      {toasts.map((item) => (
        <div
          key={item.id}
          className={`p-2 rounded shadow-2xl flex items-center gap-2 max-w-md ${containerStyles[item.type]}`}
          style={{ padding: "8px" }}
        >
          {icons[item.type]}
          <div className="text-xs font-semibold">{item.message}</div>
          <button
            onClick={() => toast.dismiss(item.id)}
            className="ml-auto hover:bg-black/10 rounded p-1 cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}