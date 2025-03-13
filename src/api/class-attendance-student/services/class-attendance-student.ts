/**
 * class-attendance-student service
 * https://docs.strapi.io/dev-docs/api/document-service#create
 * https://docs.strapi.io/dev-docs/api/rest/interactive-query-builder
 * Note: Filter if its was a array, its required to use filters at the next level 
 */


const { createCoreService: createCoreServiceAttendance } = require('@strapi/strapi').factories;
import { DateTime } from "../../../utils/datetime";
import { URL_Request } from "../../../utils/url-request";

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
                .service("api::class-attendance-student.class-attendance-student")
                .createAttendanceAndDetails(classData);

            return data;
        } catch (err) {
            console.error('Error in recurring service:', err);
            throw err;
        }
    },
    async createAttendanceAndDetails(classData) {
        try {
            const holidayData = await strapi
                .service("api::class-attendance-student.class-attendance-student")
                .getHolidaySchedule();


            const currentDate: Date = new Date();
            const closeSubmitNHour = 24 // In Hour, Replace to Strapi Configuration

            // Loop through each class in classData
            for (const classItem of classData) {
                // Every Monday 12am, create all the attendance for the week
                const classDate: Date = DateTime.nextDateBasedDay(currentDate, classItem.classDay)
                const attendanceDateTime: Date = DateTime.combineDateAndTime(classDate, classItem.classTime);

                // Check if classDate matches any holiday date
                const isHoliday = holidayData.some(holiday => {
                    const holidayDate = new Date(holiday.date)
                    return holidayDate.toDateString() === classDate.toDateString();
                });

                // If classDate is a holiday, skip the creation
                if (isHoliday) {
                    console.log(`Skipping class on ${classDate.toDateString()} due to holiday.`);
                    continue;
                }

                // Step 1: Create an attendance record for each class
                const attendance = await strapi.documents('api::class-attendance.class-attendance').create({
                    data: {
                        date: classDate, // Set the date for the attendance
                        className: classItem.documentId, // Reference to the class
                        startTime: classItem.classTime, // Set the start time for the class
                        endTime: DateTime.addDurationToTime(classItem.classTime, classItem.classDuration), // Set the end time for the class
                        submitEndDateTime: DateTime.addHourToDate(attendanceDateTime, closeSubmitNHour), // Set the end time for submitting attendance
                        type: "A. 研讨班",
                        updatedBy: "2", // By default: System Helpdesk, set the updatedBy and createdAt fields to the ID of the admin user
                        createdBy: "2" // By default: System Helpdesk, set the updatedBy and createdAt fields to the ID of the admin user
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
                            updatedBy: "2", // By default: System Helpdesk, set the updatedBy and createdAt fields to the ID of the admin user
                            createdBy: "2" // By default: System Helpdesk, set the updatedBy and createdAt fields to the ID of the admin users
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
    async getHolidaySchedule() {
        try {
            const currentDate: Date = new Date(); // Monday
            const nextWeek: Date = DateTime.nextDateBasedDay(currentDate, "Sunday") // Until One Week

            return await strapi.documents('api::holiday-schedule.holiday-schedule').findMany({
                filters: {
                    date: {
                        $between: [currentDate, nextWeek]
                    }
                }
            });
        } catch (err) {
            console.error("Error holiday schedule:", err);
            throw err;
        }
    },
    async currentAttendanceService(ctx) {
        try {
            const user = ctx.state.user;
            const currentDate = new Date();
            const currentTime = DateTime.getTimeString(currentDate);

            const openTakeAttendanceNMinute = 60 // In Minutes, Replace to Strapi Configuration
            const closeTakeAttendanceNMinute = 30 // In Minutes, Replace to Strapi Configuration

            const openTakeTime = DateTime.addDurationToTime(currentTime, openTakeAttendanceNMinute, false);
            const closeTakeTime = DateTime.subtractDurationFromTime(currentTime, closeTakeAttendanceNMinute, false);

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
                        fields: ["id", "type", "date", "startTime", "endTime"],
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
            console.error('Error in service:', err);
            throw err;
        }
    },
    async attendanceHistoryService(ctx) {
        try {
            const user = ctx.state.user;
            const currentDate = new Date();

            const paramType = URL_Request.getTypeFromUrl(ctx.request, 'type');
            const type = paramType == "other" ? { $ne: "A. 研讨班" as const } : { $eq: "A. 研讨班" as const };

            const lastNMonthHistory = 3 // Replace to Strapi Configuration
            const lastDateHistory = DateTime.getLastNMonthsDate(currentDate, lastNMonthHistory);

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
            console.error('Error in service:', err);
            throw err;
        }
    }
};