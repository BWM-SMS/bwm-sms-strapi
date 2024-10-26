/**
 * class-custom service
 */


const { createCoreService: createCoreServiceClass } = require('@strapi/strapi').factories;

module.exports = {
    async findAllBlogs(ctx) {
        const user = ctx.state.user;

        console.log("Data", user);
        //   return [];
        return await strapi.db.query('api::class.class').findMany({
            where: {
                userClasses: {
                    username: {
                        id: user.id
                    }
                }
            },
            populate: {

                userClasses: {
                    fields: ["id"],
                    populate: {
                        username: {
                            fields: ['englishName', 'chineseName']
                        }
                    }
                }
            },
            orderBy: {
                className: "asc"
            }
        });

    },
};