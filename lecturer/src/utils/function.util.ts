import moment from "moment";

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

export const formatTime = (isoString: string, referenceStart?: string) => {
    const m = moment.utc(isoString)
    if (referenceStart) {
        const start = moment.utc(referenceStart)
        if (m.isBefore(start)) {
            m.add(12, "hours")
        }
    }
    return m.format("hh:mm A")
}

export const formatWeekday = (date: Date) => moment(date).format("dddd")

export const formatMonthDay = (date: Date) => moment(date).format("MMMM D")