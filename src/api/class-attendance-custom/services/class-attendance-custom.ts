import { mergeConfig } from 'vite';
/**
 * class-attendance-custom service
 * https://docs.strapi.io/dev-docs/api/document-service#create
 * Note: Filter if its was a array, its required to use filters at the next level 
 */


const { createCoreService: createCoreServiceAttendance } = require('@strapi/strapi').factories;

module.exports = {
    async recurringService() {
        try {
            // Reccuring Daily at 12am; Now change to every Monday 12am to create all the attendance for the week
            // const currentDate = new Date();
            // const currentDay = currentDate.getDay();
            // const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            // const currentDayName: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" = dayNames[currentDay] as "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

            const classData = await strapi.documents('api::class.class').findMany({
                filters: {
                    isActive: true,
                },
                populate: {
                    userClasses: {
                        fields: ["position"],
                        populate: {
                            username: {
                                fields: ["username"]
                            }
                        },
                        filters: {
                            isActive: true
                        }
                    }
                }
            });

            const data = await strapi
                .service("api::class-attendance-custom.class-attendance-custom")
                .createAttendanceAndDetails(classData);

            return data;
        } catch (err) {
            console.error('Error in recurring service:', err);
            throw err;
        }
    },
    async createAttendanceAndDetails(classData) {
        try {
            // Loop through each class in classData
            for (const classItem of classData) {
                // Every Monday 12am, create all the attendance for the week
                const currentDate: Date = new Date();
                const classDate: Date = nextDateBasedDay(currentDate, classItem.classDay)

                // Step 1: Create an attendance record for each class
                const attendance = await strapi.documents('api::class-attendance.class-attendance').create({
                    data: {
                        date: classDate, // Set the date for the attendance
                        className: classItem.documentId, // Reference to the class
                        startTime: classItem.classTime, // Set the start time for the class
                        endTime: addDurationToTime(classItem.classTime, classItem.classDuration), // Set the end time for the class
                        type: "A. 研讨班",
                        updatedBy: "1", // By default, set the updatedBy and createdAt fields to the ID of the admin user
                        createdBy: "1" // By default, set the updatedBy and createdAt fields to the ID of the admin user
                    },
                });

                // Retrieve the ID of the created attendance record
                const attendanceId = attendance.documentId;

                //  Step 2: Create attendance details for each user in the class
                for (const userClass of classItem.userClasses) {
                    await strapi.documents('api::class-attendance-detail.class-attendance-detail').create({
                        data: {
                            classAttendance: attendanceId, // Reference to the attendance record
                            username: userClass.username.documentId, // Reference to the user
                            position: userClass.position,
                            isAttend: false,
                            updatedBy: "1", // By default, set the updatedBy and createdAt fields to the ID of the admin user
                            createdBy: "1" // By default, set the updatedBy and createdAt fields to the ID of the admin users
                        },
                    });
                }
            }
            return { message: "Attendance and attendance details created successfully." }
        } catch (err) {
            console.error("Error creating attendance and attendance details:", err);
            throw err;
        }

    },
    async currentAttendanceService(ctx) {
        try {
            const user = ctx.state.user;
            const currentDate = new Date();
            const currentTime = getTimeString(currentDate);

            const openTakeAttendance = 60 // Replace to Strapi Configuration
            const closeTakeAttendance = 30 // Replace to Strapi Configuration

            const openTakeTime = addDurationToTime(currentTime, openTakeAttendance);
            const closeTakeTime = subtractDurationFromTime(currentTime, closeTakeAttendance);

            const classData = await strapi.documents('api::class-attendance-detail.class-attendance-detail').findMany({
                filters: {
                    isAttend: false,
                    username: user.id,
                    classAttendance: {
                        date: currentDate,
                        startTime: {
                            $lte: openTakeTime
                        },
                        endTime: {
                            $gte: closeTakeTime
                        }
                    }
                },
                populate: {
                    classAttendance: {
                        fields: ["id", "type","date", "startTime", "endTime"],
                        populate: {
                            className: {
                                fields: ["id", "className"]
                            }
                        }
                    },
                    username: {
                        fields: ["id", "englishName", "chineseName"]
                    }
                }
            });


            return classData;
        } catch (err) {
            console.error('Error in recurring service:', err);
            throw err;
        }
    },
    async attendanceHistoryService(ctx) {
        try {
            const user = ctx.state.user;
            const currentDate = new Date();

            const paramType = getTypeFromUrl(ctx.request, 'type');
            const type = paramType == "other" ? { $ne: "A. 研讨班" as "A. 研讨班" | "B. 忆师恩" } : { $eq: "A. 研讨班" as "A. 研讨班" | "B. 忆师恩" };

            const lastNMonthHistory = 3 // Replace to Strapi Configuration
            const lastDateHistory = getLastNMonthsDate(currentDate, lastNMonthHistory);

            const classData = await strapi.documents('api::class-attendance-detail.class-attendance-detail').findMany({
                filters: {
                    username: user.id,
                    position: "D. 学员",
                    classAttendance: {
                        type: type,
                        date: {
                            $between: [lastDateHistory, currentDate]
                        },
                    }
                },
                populate: {
                    classAttendance: {
                        fields: ["id", "date", "type", "lesson"],
                    },
                },
                sort: "createdAt:desc"
            });

            return classData;
        } catch (err) {
            console.error('Error in recurring service:', err);
            throw err;
        }
    }

};

function addDurationToTime(timeString: string, durationMinutes: number): string {
    // Parse the time string into a Date object
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const baseDate = new Date();
    baseDate.setHours(hours, minutes, seconds, 0);

    // Add the duration in minutes
    const newTime = new Date(baseDate.getTime() + durationMinutes * 60000);

    return getTimeString(newTime);
}

function subtractDurationFromTime(timeString: string, durationMinutes: number): string {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const baseDate = new Date();
    baseDate.setHours(hours, minutes, seconds, 0);

    // Subtract the duration in minutes
    const newTime = new Date(baseDate.getTime() - durationMinutes * 60000);

    return getTimeString(newTime);
}

function getTimeString(date: Date): string {
    return date.toTimeString().split(' ')[0];
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

function getTypeFromUrl(ctx: any, param: string): string | null {
    const fullUrl = ctx.host + ctx.url
    const url = new URL(fullUrl, ctx.host); // Base URL is required for URL parsing
    const params = new URLSearchParams(url.search);
    return params.get(param);
}