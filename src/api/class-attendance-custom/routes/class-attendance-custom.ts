export default {
  routes: [
    {
     method: 'GET',
     path: '/class-attendance/recurring',
     handler: 'class-attendance-custom.recurring',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
