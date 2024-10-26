export default {
  routes: [
    {
     method: 'GET',
     path: '/class-attendance/recurring',
     handler: 'class-attendance-custom.recurring',
    },
    {
      method: 'GET',
      path: '/class-attendance/current',
      handler: 'class-attendance-custom.currentAttendance',
     },
     {
      method: 'GET',
      path: '/class-attendance/history',
      handler: 'class-attendance-custom.attendanceHistory',
     },
  ],
};
