export default {
    myJob: {
        task: async ({ strapi }) => {
            try {
                // Call the recurring API
                const attendanceJob = await strapi.service('api::class-attendance-custom.class-attendance-custom').recurringService();
                console.log(`Recurring task executed successfully. ${attendanceJob.message}`);
            } catch (err) {
                console.error('Error executing recurring task:', err);
            }
        },
        options: {
            rule: "0 0 * * * *",
            tz: "Asia/Singapore"
        }
    },
};