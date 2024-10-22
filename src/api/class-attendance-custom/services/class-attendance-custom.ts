/**
 * class-attendance-custom service
 * https://docs.strapi.io/dev-docs/api/document-service#create
 */


const { createCoreService: createCoreServiceAttendance } = require('@strapi/strapi').factories;

module.exports = {
    async recurring(classData) {
        try {
            // Loop through each class in classData
            for (const classItem of classData) {

                // Step 1: Create an attendance record for each class
                const attendance = await strapi.documents('api::class-attendance.class-attendance').create({
                    data: {
                        date: new Date(), // Set the date for the attendance
                        className: classItem.documentId, // Reference to the class
                        type: "A. 研讨班",
                        updatedBy: "1", // By default, set the updatedBy and createdAt fields to the ID of the admin user
                        createdBy: "1" // By default, set the updatedBy and createdAt fields to the ID of the admin user
                    },
                });

                // Retrieve the ID of the created attendance record
                const attendanceId = attendance.documentId;

                //  Step 2: Create attendance details for each user in the class
                for (const userClass of classItem.userClasses) {
                    await strapi.entityService.create('api::class-attendance-detail.class-attendance-detail', {
                        data: {
                            classAttendance: attendanceId, // Reference to the attendance record
                            username: userClass.username.documentId, // Reference to the user
                            isAttend: undefined,
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
};