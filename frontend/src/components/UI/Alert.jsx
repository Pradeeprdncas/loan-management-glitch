// src/components/UI/Alert.jsx
import { CheckCircle, Info } from "lucide-react";

export default function Alert({ type = "success", message }) {
  if (!message) return null;

  const styles = {
    success: "bg-green-50 border-green-400 text-green-800",
    failure: "bg-red-50 border-red-400 text-red-800",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    failure: <Info className="w-5 h-5 text-red-600" />,
  };

  return (
    <div
      className={`flex items-center gap-2 border-l-4 p-3 rounded-md shadow-sm transition-all duration-300 ease-in-out ${styles[type]}`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
