/**
 * class-custom service
 */


const { createCoreService: createCoreServiceClass } = require('@strapi/strapi').factories;

module.exports = {
    async myClassService(ctx) {
        const user = ctx.state.user;
        const studentClassData = await strapi.documents('api::user-class.user-class').findFirst({
            filters: {
                position: "D. 学员",
                username: user.id,
                isActive: true
            },
            populate: {
                className: {
                    fields: ["id"]
                }
            }

        });

        const classData = await strapi.documents('api::class.class').findFirst({
            filters: {
                id: studentClassData.className.id,
                isActive: true,
            },
            populate: {
                fields: ["className", "classTime", "classDuration", "classDay", "venue", "room"],
                userClasses: {
                    filters: {
                        isActive: true
                    },
                    populate: {
                        fields: ["position"],
                        sort: "position:acs",
                        username: {
                            fields: ["id", "englishName", "chineseName", "phoneNumber"],
                            populate: {
                                image: {
                                    fields: ["url"]
                                }
                            },
                        },
                    }
                }
            }
        });

        return classData;

    },
};