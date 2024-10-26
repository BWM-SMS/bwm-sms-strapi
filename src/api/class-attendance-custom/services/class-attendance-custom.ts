/**
 * class-attendance-custom service
 * https://docs.strapi.io/dev-docs/api/document-service#create
 */


const { createCoreService: createCoreServiceAttendance } = require('@strapi/strapi').factories;

module.exports = {
    async recurringService() {
        try {
            const currentDate = new Date();
            const currentDay = currentDate.getDay();
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const currentDayName: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" = dayNames[currentDay] as "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

            const classData = await strapi.documents('api::class.class').findMany({
                filters: {
                    classDay: currentDayName
                },
                populate: {
                    userClasses: {
                        fields: ["id"],
                        populate: {
                            username: {
                                fields: ['username']
                            }
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

                // Step 1: Create an attendance record for each class
                const attendance = await strapi.documents('api::class-attendance.class-attendance').create({
                    data: {
                        date: new Date(), // Set the date for the attendance
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
                    },
                },
                populate: {
                    classAttendance: {
                        fields: ["id", "date", "startTime", "endTime"],
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

            const lastNMonthHistory = 3 // Replace to Strapi Configuration

            const lastDateHistory = getLastNMonthsDate(currentDate, lastNMonthHistory);
            console.log(lastDateHistory);

            const classData = await strapi.documents('api::class-attendance-detail.class-attendance-detail').findMany({
                filters: {
                    username: user.id,
                    classAttendance: {
                        date: {
                            $gte: lastDateHistory
                        },
                    },
                },
                populate: {
                    classAttendance: {
                        fields: ["id", "date"]
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
    currentDate.setMonth(currentDate.getMonth() - n);
    return currentDate;
}