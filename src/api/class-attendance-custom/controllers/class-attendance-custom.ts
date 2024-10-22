/**
 * A set of functions called "actions" for `class-custom`
 */

export default {
  recurring: async (ctx, next) => {
    try {
      // Custom logic here
      const currentDate = new Date();
      const currentDay = currentDate.getDay();

      // Array to map numeric day values to day names
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

      // Get the current day name
      const currentDayName = dayNames[currentDay];

      const classData = await strapi.db.query('api::class.class').findMany({
        where: {
          classDay: currentDayName
        },
        populate: {
          userClasses: {
            fields: ["id"],
            populate: {
              username: {
                fields: ['username']
              }
            }
          }
        }
      });

      const data = await strapi
        .service("api::class-attendance-custom.class-attendance-custom")
        .recurring(classData);

      ctx.body = data;
    } catch (err) {
      ctx.body = err;
    }
  }
};
