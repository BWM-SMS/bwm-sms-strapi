/**
 * class-attendance-student service
 * https://docs.strapi.io/dev-docs/api/document-service#create
 * https://docs.strapi.io/dev-docs/api/rest/interactive-query-builder
 * Note: Filter if its was a array, its required to use filters at the next level 
 */


const { createCoreService: createCoreServiceAttendanceCadre } = require('@strapi/strapi').factories;

module.exports = {
    async currentClassService(ctx) {
        try {
            const user = ctx.state.user;
            const currentDate = new Date();

            const classData = await strapi.documents('api::user-class.user-class').findMany({
                filters: {
                    isActive: true,
                    username: user.id,
                    position: {
                        $ne: "D. 学员"
                    },
                    className: { isActive: true },
                },
                populate: {
                    className: {
                        fields: ["id", "className", "type", "language"],
                    },
                }
            });

            return classData;
        } catch (err) {
            console.error('Error in recurring service:', err);
            throw err;
        }
    },
    async currentClassAttendanceService(ctx) {
        try {
            const user = ctx.state.user;
            const { classId } = ctx.params;

            const currentDate = new Date();

            // Getting this week start and end date
            const { startDate, endDate } = getWeekStartAndEndDate(currentDate);

            const attendanceData = await strapi.documents('api::class-attendance.class-attendance').findFirst({
                filters: {
                    className: {
                        documentId: classId,
                        isActive: true
                    },
                    date: {
                        $between: [startDate, endDate]
                    },
                },
                populate: {
                    className: {
                        fields: ["className"],
                    },
                    classAttendanceDetails: {
                        populate: {
                            username: {
                                fields: ["username", "englishName", "chineseName"],
                            },
                        }
                    }
                }
            });
            return attendanceData;
        } catch (err) {
            console.error('Error in recurring service:', err);
            throw err;
        }
    },
    async classAttendanceHistoryService(ctx) {
        try {
            const user = ctx.state.user;
            const { classId } = ctx.params;
            const currentDate = new Date();

            const paramType = getTypeFromUrlCadre(ctx.request, 'type');
            const paramAttendanceId = getTypeFromUrlCadre(ctx.request, 'attendanceId');
            const type = paramType == "other" ? { $ne: "A. 研讨班" as "A. 研讨班" | "B. 忆师恩" } : { $eq: "A. 研讨班" as "A. 研讨班" | "B. 忆师恩" };

            const lastNMonthHistory = 3 // Replace to Strapi Configuration
            const lastDateHistory = getLastNMonthsDateCadre(currentDate, lastNMonthHistory);

            let classData
            if (paramAttendanceId == null) {
                // Query all the attendance records
                classData = await strapi.documents('api::class-attendance.class-attendance').findMany({
                    filters: {
                        className: {
                            documentId: classId
                        },
                        type: type,
                        date: {
                            $between: [lastDateHistory, currentDate]
                        },
                    },
                    populate: {
                        classAttendanceDetails: {
                            fields: ["isAttend"],
                        },
                    },
                    sort: "date:desc"
                });
            } else {
                classData = await strapi.documents('api::class-attendance.class-attendance').findOne({
                    documentId: paramAttendanceId,
                    filters: {
                        className: {
                            documentId: classId
                        },
                        documentId: paramAttendanceId,
                        type: type,
                        date: {
                            $between: [lastDateHistory, currentDate]
                        },
                    },
                    populate: {
                        classAttendanceDetails: {
                            fields: ["isAttend", "position"],
                            populate: {
                                username: {
                                    fields: ["englishName", "chineseName"],
                                },
                            }
                        },
                    },
                    sort: "date:desc"
                });
            }

            return classData;
        } catch (err) {
            console.error('Error in recurring service:', err);
            throw err;
        }
    },


};

function getWeekStartAndEndDate(currentDate: Date): { startDate: Date, endDate: Date } {
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);

    // Set the start date to the previous Monday
    startDate.setDate(currentDate.getDate() - (currentDate.getDay() + 6) % 7);

    // Set the end date to the next Sunday
    endDate.setDate(currentDate.getDate() + (7 - currentDate.getDay()) % 7);

    return { startDate, endDate };
}

function getTypeFromUrlCadre(ctx: any, param: string): string | null {
    // TODO: Same function logic as studentt due to duplicate function name from strapi, required to standarised into common function
    const fullUrl = ctx.host + ctx.url
    const url = new URL(fullUrl, ctx.host); // Base URL is required for URL parsing
    const params = new URLSearchParams(url.search);
    return params.get(param);
}


function getLastNMonthsDateCadre(currentDate: Date, n: number): Date {
    // TODO: Same function logic as studentt due to duplicate function name from strapi, required to standarised into common function
    const newDate = new Date(currentDate); // Create a new Date object to avoid mutating the original
    newDate.setMonth(newDate.getMonth() - n);
    return newDate;
}