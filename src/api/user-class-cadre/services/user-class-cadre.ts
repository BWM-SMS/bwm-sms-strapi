/**
 * class-attendance-student service
 * https://docs.strapi.io/dev-docs/api/document-service#create
 * https://docs.strapi.io/dev-docs/api/rest/interactive-query-builder
 * Note: Filter if its was a array, its required to use filters at the next level 
 */


const { createCoreService: createCoreServiceAttendanceCadre } = require('@strapi/strapi').factories;

module.exports = {
    async resetPasswordService(ctx) {
        try {
            // const user = ctx.state.user;
            // TODO: Check if the user has permission to reset password for their class only
            const {studentId} = ctx.request.body

            // Generate a random 6-digit number
            const generatedPassword = Math.floor(100000 + Math.random() * 900000).toString();

            // Update the user's password
            const classData = await strapi.documents('plugin::users-permissions.user').update({
                documentId: studentId,
                data: {
                    password: generatedPassword,
                },
            });

            // If update is successful, return the generated password
            if (classData) {
                return {'temporaryPin':generatedPassword};
            } else {
                throw {'message': 'Failed to reset password'};
            }
        } catch (err) {
            console.error('Error in class service:', err);
            throw err;
        }
    },
};
