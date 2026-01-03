const NotificationBanner = ({
  type,
  message,
  onClear,
}: {
  type: "success" | "error";
  message: string;
  onClear: () => void;
}) => {
  return (
    <div
      className={`px-4 py-3 flex justify-between items-center text-sm ${
        type === "success"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      <span>{message}</span>
      <button onClick={onClear} className="font-bold">
        ×
      </button>
    </div>
  );
};

export default NotificationBanner;
