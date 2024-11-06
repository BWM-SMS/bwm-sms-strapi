/**
 * A set of functions called "actions" for `class-student`
 */

export default {
  recurring: async (ctx, next) => {
    try {
      // Recurring for the class attendance at 12am to generate a list
      const data = await strapi
        .service("api::class-attendance-student.class-attendance-student")
        .recurringService();

      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
  currentAttendance: async (ctx, next) => {
    // Take the current user attandance based on time
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
      }
      const data = await strapi
        .service("api::class-attendance-student.class-attendance-student")
        .currentAttendanceService(ctx);

      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
  attendanceHistory: async (ctx, next) => {
    // Personal Class Attendance History
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
      }
      
      const data = await strapi
        .service("api::class-attendance-student.class-attendance-student")
        .attendanceHistoryService(ctx);

      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  }
};
