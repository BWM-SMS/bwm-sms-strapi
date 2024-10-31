export default {
  routes: [
    {
      method: 'GET',
      path: '/class-attendance/current/class',
      handler: 'class-attendance-cadre.currentClass',
     },
    {
     method: 'GET',
     path: '/class-attendance/current/cadre/:classId',
     handler: 'class-attendance-cadre.currentClassAttendance',
    },
    {
     method: 'GET',
     path: '/class-attendance/history/cadre/:classId',
     handler: 'class-attendance-cadre.classAttendanceHistory',
    },
  ],
};
