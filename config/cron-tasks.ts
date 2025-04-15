export default {
  attendanceCreation: {
    task: async ({ strapi }) => {
      try {
        // Call the recurring API
        const attendanceJob = await strapi.service('api::class-attendance-student.class-attendance-student').recurringService();
        console.log(`Recurring Attendance Creation executed successfully. ${attendanceJob.message}`);
      } catch (err) {
        console.error('Error executing recurring task:', err);
      }
    },
    options: {
      rule: '0 0 * * 1',
      tz: 'Asia/Singapore'
    }
  },
  attendanceNotification: {
    task: async ({ strapi }) => {
      try {
        // Call the recurring API
        const attendanceJob = await strapi.service('api::user-notification.user-notification').notifyClassStartSoonService();
        console.log(`Recurring Attendance Notification executed successfully. ${attendanceJob.message}`);
      } catch (err) {
        console.error('Error executing recurring task:', err);
      }
    },
    options: {
      rule: '*/15 * * * *',
      tz: 'Asia/Singapore'
    }
  }
};
