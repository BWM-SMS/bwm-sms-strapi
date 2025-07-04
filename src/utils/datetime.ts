
function addDurationToTime(timeString: string, durationMinutes: number, isAllowCross: boolean = true): string {
    // Parse the time string into a Date object
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const baseDate = new Date();
    baseDate.setHours(hours, minutes, seconds, 0);

    // Add the duration in minutes
    const newTime = new Date(baseDate.getTime() + durationMinutes * 60000);

    // Ensure the new time does not cross into the next day
    if (isAllowCross == false) {
        if (newTime.getDate() !== baseDate.getDate()) {
            newTime.setHours(23, 59, 59, 999); // Set to the last millisecond of the same day
        }
    }

    return getTimeString(newTime);
}

function subtractDurationFromTime(timeString: string, durationMinutes: number, isAllowCross: boolean = true): string {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const baseDate = new Date();
    baseDate.setHours(hours, minutes, seconds, 0);

    // Subtract the duration in minutes
    const newTime = new Date(baseDate.getTime() - durationMinutes * 60000);

    // Ensure the new time does not cross into the previous day
    if (isAllowCross == false) {
        if (newTime.getDate() !== baseDate.getDate()) {
            newTime.setHours(0, 0, 0, 0); // Set to the first millisecond of the same day
        }
    }

    return getTimeString(newTime);
}

function addHourToDate(date: Date, hour: number): Date {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + hour);
    return newDate;
}

function getTimeString(date: Date): string {
    const newDate = new Date(date); // Create a new Date object to avoid mutating the original
    return newDate.toTimeString().split(' ')[0];
}

function getLastNMonthsDate(currentDate: Date, n: number): Date {
    const newDate = new Date(currentDate); // Create a new Date object to avoid mutating the original
    newDate.setMonth(newDate.getMonth() - n);
    return newDate;
}

function nextDateBasedDay(currentDate: Date, classDay: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"): Date {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const targetDayIndex = dayNames.indexOf(classDay);
    const daysUntilNextClass = (targetDayIndex - currentDate.getDay() + 7) % 7;
    const nextClassDate = new Date(currentDate);
    nextClassDate.setDate(currentDate.getDate() + daysUntilNextClass); // Ensure it moves to the next week if the day is the same
    return nextClassDate;
}

function getWeekStartAndEndDate(currentDate: Date, extraDays: number = 0): { startDate: Date, endDate: Date } {
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);

    // Set the start date to the previous Monday
    startDate.setDate(currentDate.getDate() - (currentDate.getDay() + 6) % 7);

    // Set the end date to the next Sunday and add extra days
    endDate.setDate(currentDate.getDate() + (7 - currentDate.getDay()) % 7 + extraDays);

    return { startDate, endDate };
}

function combineDateAndTime(date: Date, time: string): Date {
    // Remove the time part from the date
    const dateOnly = new Date(date.toDateString());

    // Split the time string into hours, minutes, and seconds
    const [hours, minutes, seconds] = time.split(':').map(Number);

    // Set the hours, minutes, and seconds to the date
    dateOnly.setHours(hours, minutes, seconds);

    return dateOnly;
}

const DateTime = {
    addDurationToTime,
    subtractDurationFromTime,
    getTimeString,
    getLastNMonthsDate,
    nextDateBasedDay,
    getWeekStartAndEndDate,
    combineDateAndTime,
    addHourToDate
};

export { DateTime };
