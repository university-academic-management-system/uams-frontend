
export const capitaliseName = (name: string | undefined): string => {
  if (!name) return "—";
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatLevel = (level: string | undefined): string => {
  if (!level) return "—";
  return level.replace(/^L/, "");
};