/**
 * A set of functions called "actions" for `class-cadre`
 */

export default {
  resetPassword: async (ctx, next) => {
    // Reset Password
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
      }

      const data = await strapi
        .service("api::user-class-cadre.user-class-cadre")
        .resetPasswordService(ctx);

      ctx.body = data;
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = { message: err.message || 'An unexpected error occurred' };
    }
  },
 
};
