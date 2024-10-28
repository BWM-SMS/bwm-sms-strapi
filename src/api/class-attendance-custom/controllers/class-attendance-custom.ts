/**
 * A set of functions called "actions" for `class-custom`
 */

export default {
  recurring: async (ctx, next) => {
    try {
      // Recurring for the class attendance at 12am to generate a list
      const data = await strapi
        .service("api::class-attendance-custom.class-attendance-custom")
        .recurringService();

      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
  currentAttendance: async (ctx, next) => {
    // Take the current user attandance based on time
    try {
      const data = await strapi
        .service("api::class-attendance-custom.class-attendance-custom")
        .currentAttendanceService(ctx);

      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
  attendanceHistory: async (ctx, next) => {
    // Personal Class Attendance History
    try {
      const data = await strapi
        .service("api::class-attendance-custom.class-attendance-custom")
        .attendanceHistoryService(ctx);

      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  }
};
