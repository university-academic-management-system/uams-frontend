import moment from "moment";

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const normalizeLevel = (level: string) => level.replace("L", "");

export const normalizeSemester = (semester: string) => `${semester === "FIRST" ? "1st Semester" : "2nd Semester"}`;

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
    }).format(amount);
}

export const toTitleCase = (str: string) => str[0].toUpperCase() + str.slice(1).toLowerCase().replaceAll("_", " ");


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


export const gradeColor = (grade: string) => {
    if (grade === "A") {
        return "green";
    }
    if (grade === "B") {
        return "blue";
    }
    if (grade === "C") {
        return "gray";
    }
    if (grade === "D") {
        return "yellow";
    }
    if (grade === "E") {
        return "orange";
    }
    if (grade === "F") {
        return "red";
    }
    return "gray";
}