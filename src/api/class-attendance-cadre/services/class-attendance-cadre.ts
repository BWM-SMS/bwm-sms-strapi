/**
 * class-attendance-student service
 * https://docs.strapi.io/dev-docs/api/document-service#create
 * https://docs.strapi.io/dev-docs/api/rest/interactive-query-builder
 * Note: Filter if its was a array, its required to use filters at the next level 
 */


const { createCoreService: createCoreServiceAttendanceCadre } = require('@strapi/strapi').factories;
import { DateTime } from "../../../utils/datetime";
import { URL_Request } from "../../../utils/url-request";

module.exports = {
    async currentClassService(ctx) {
        try {
            const user = ctx.state.user;

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
            console.error('Error in class service:', err);
            throw err;
        }
    },
    async currentClassAttendanceService(ctx) {
        try {
            const user = ctx.state.user;
            const { classId } = ctx.params;

            const currentDate = new Date();

            // Getting this week start and end date
            const { startDate, endDate } = DateTime.getWeekStartAndEndDate(currentDate, 1);

            const attendanceData = await strapi.documents('api::class-attendance.class-attendance').findFirst({
                filters: {
                    className: {
                        documentId: classId,
                        isActive: true
                    },
                    submitEndDateTime: {
                        $gte: currentDate
                    },
                    date: {
                        $lte: endDate
                    }
                },
                populate: {
                    className: {
                        fields: ["className"],
                    },
                    classAttendanceDetails: {
                        populate: {
                            username: {
                                fields: ["username", "englishName", "chineseName"],
                                populate: {
                                    image: {
                                        fields: ["url"]
                                    }
                                }
                            },
                        }
                    }
                }
            });
            return attendanceData;
        } catch (err) {
            console.error('Error in attendance service:', err);
            throw err;
        }
    },
    async classAttendanceHistoryService(ctx) {
        try {
            const user = ctx.state.user;
            const { classId } = ctx.params;
            const currentDate = new Date();

            const paramType = URL_Request.getTypeFromUrl(ctx.request, 'type');
            const paramAttendanceId = URL_Request.getTypeFromUrl(ctx.request, 'attendanceId');
            const type = paramType == "other" ? { $ne: "A. 研讨班" as const } : { $eq: "A. 研讨班" as const };
            
            const lastNMonthHistory = 3 // Replace to Strapi Configuration
            const lastDateHistory = DateTime.getLastNMonthsDate(currentDate, lastNMonthHistory);

            let attendanceData
            if (paramAttendanceId == null) {
                // Query all the attendance records
                attendanceData = await strapi.documents('api::class-attendance.class-attendance').findMany({
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
                            fields: ["isAttend", "position"],
                        },
                    },
                    sort: "date:desc"
                });
            } else {
                attendanceData = await strapi.documents('api::class-attendance.class-attendance').findOne({
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
                                    fields: ["englishName", "chineseName", "username"],
                                },
                            }
                        },
                    },
                    sort: "date:desc"
                });
            }

            return attendanceData;
        } catch (err) {
            console.error('Error in attendance history service:', err);
            throw err;
        }
    },
    async classAttendanceHistoryByStudentService(ctx) {
        try {
            const { classId } = ctx.params;

            const currentDate = new Date();

            const lastNMonthHistory = 3 // Replace to Strapi Configuration
            const lastDateHistory = DateTime.getLastNMonthsDate(currentDate, lastNMonthHistory);

            const attendanceData = await strapi.documents('api::user-class.user-class').findMany({
                filters: {
                    className: {
                        documentId: classId,
                    },
                },
                populate: {
                    username: {
                        fields: ["englishName", "chineseName"],
                        populate: {
                            classAttendanceDetails: {
                                filters: {
                                    classAttendance: {
                                        className: {
                                            documentId: classId,
                                        },
                                        date: {
                                            $between: [lastDateHistory, currentDate]
                                        },
                                    }
                                },
                                fields: ["isAttend"]
                            },
                            image: {
                                fields: ["url"]
                            }
                        }
                    },
                }
            });
            return attendanceData;
        } catch (err) {
            console.error('Error in attendance history by class service:', err);
            throw err;
        }
    },
    async studentAttendanceHistoryService(ctx) {
        try {
            const { classId, studentId } = ctx.params;

            const currentDate = new Date();

            const lastNMonthHistory = 3 // Replace to Strapi Configuration
            const lastDateHistory = DateTime.getLastNMonthsDate(currentDate, lastNMonthHistory);

            const userData = await strapi.documents('plugin::users-permissions.user').findOne({
                documentId: studentId,
                fields: ["englishName", "chineseName", "phoneNumber", "gender", "birthYear", "joinYear", "hobby", "skill"],
                populate: {
                    image: {
                        fields: ["url"]
                    }
                }
            });

            const attendanceData = await strapi.documents('api::class-attendance-detail.class-attendance-detail').findMany({
                filters: {
                    username: {
                        documentId: studentId,
                    },
                    classAttendance: {
                        className: {
                            documentId: classId,
                        },
                        date: {
                            $between: [lastDateHistory, currentDate]
                        },
                    }
                },
                populate: {
                    classAttendance: {
                        fields: ["date", "type", "lesson"],
                    }
                }
            });
            return { user: userData, attendance: attendanceData };
        } catch (err) {
            console.error('Error in class attendance history by student service:', err);
            throw err;
        }
    },
};
