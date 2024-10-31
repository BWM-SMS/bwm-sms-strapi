/**
 * A set of functions called "actions" for `class-cadre`
 */

export default {
  currentClass: async (ctx, next) => {
    // Take the current user attandance based on time
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
      }

      const data = await strapi
        .service("api::class-attendance-cadre.class-attendance-cadre")
        .currentClassService(ctx);

      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
  currentClassAttendance: async (ctx, next) => {
    // Take the current user attandance based on time
    try {
      const user = ctx.state.user;
      const { classId } = ctx.params;

      if (!user) {
        return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
      }

      if (!classId) {
        return ctx.badRequest(null, [{ messages: [{ id: 'No class id' }] }]);
      }

      const data = await strapi
        .service("api::class-attendance-cadre.class-attendance-cadre")
        .currentClassAttendanceService(ctx);

      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
  classAttendanceHistory: async (ctx, next) => {
    // Take the current user attandance based on time
    try {
      const user = ctx.state.user;
      const { classId } = ctx.params;
      
      if (!user) {
        return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
      }

      if (!classId) {
        return ctx.badRequest(null, [{ messages: [{ id: 'No class id' }] }]);
      }

      const data = await strapi
        .service("api::class-attendance-cadre.class-attendance-cadre")
        .classAttendanceHistoryService(ctx);

      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  },
};
