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

            // Getting this week start and end date
            const { startDate, endDate } = getWeekStartAndEndDate(currentDate);

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
            const currentDate = new Date();

            // Getting this week start and end date
            const { startDate, endDate } = getWeekStartAndEndDate(currentDate);

            const classData = await strapi.documents('api::user-class.user-class').findMany({
                filters: {
                    username: user.id,
                    className: {
                        classAttendances: {

                            date: {
                                $between: [startDate, endDate]
                            },
                        }
                    }

                    // 
                    // classAttendance: {
                    //     date: currentDate,
                    //     startTime: {
                    //         $lte: openTakeTime
                    //     },
                    //     endTime: {
                    //         $gte: closeTakeTime
                    //     }
                    // }
                },
                populate: {
                    className: {
                        fields: ["id", "className"],
                        populate: {
                            classAttendances: {
                                fields: ["date", "startTime", "endTime"],
                            }
                        }
                    },
                    // username: {
                    //     fields: ["id", "englishName", "chineseName"]
                    // }
                }
            });


            return classData;
        } catch (err) {
            console.error('Error in recurring service:', err);
            throw err;
        }
    }
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