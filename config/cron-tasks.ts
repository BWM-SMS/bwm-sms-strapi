export default {
    myJob: {
        task: async ({ strapi }) => {
            try {
                // Call the recurring API
                const attendanceJob = await strapi.service('api::class-attendance-student.class-attendance-student').recurringService();
                console.log(`Recurring task executed successfully. ${attendanceJob.message}`);
            } catch (err) {
                console.error('Error executing recurring task:', err);
            }
        },
        options: {
            rule: "0 0 * * 1",
            tz: "Asia/Singapore"
        }
    },
};