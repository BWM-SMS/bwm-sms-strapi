/**
 * class-attendance-student service
 * https://docs.strapi.io/dev-docs/api/document-service#create
 * https://docs.strapi.io/dev-docs/api/rest/interactive-query-builder
 * Note: Filter if its was a array, its required to use filters at the next level 
 */


const { createCoreService: createCoreServiceBWMCustom } = require('@strapi/strapi').factories;

module.exports = {
    async myProfileService(ctx) {
        try {
            const user = ctx.state.user;

            const classData = await strapi.documents('plugin::users-permissions.user').findFirst({
                filters: {
                    blocked: false,
                    documentId: user.documentId,
                },
                populate: {
                    fields: ['username', 'email', 'englishName', 'chineseName', 'phoneNumber', 'joinYear', 'hobby', 'skill', 'acceptPDPA', 'localization'],
                    role: { fields: ['name'] },
                    userClasses: {
                        fields: ['position'],
                        populate: {
                            className: {
                                fields: ['type', 'language', 'className'],
                                filters: {
                                    isActive: true,
                                },
                            }
                        },
                        filters: {
                            isActive: true,
                            position: "D. 学员"
                        },
                    },
                    image: { fields: ['url'] }
                }
            });

            return classData;
        } catch (err) {
            console.error('Error in recurring service:', err);
            throw err;
        }
    }
};
