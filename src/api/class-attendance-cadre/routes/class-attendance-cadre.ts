export default {
  routes: [
    {
      method: 'GET',
      path: '/class-attendance/current/class',
      handler: 'class-attendance-cadre.currentClass',
     },
    {
     method: 'GET',
     path: '/class-attendance/current/cadre',
     handler: 'class-attendance-cadre.currentClassAttendance',
    },
  ],
};
