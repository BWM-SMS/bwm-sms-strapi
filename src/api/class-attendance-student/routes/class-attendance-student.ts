export default {
  routes: [
    {
      method: 'GET',
      path: '/class-attendance/recurring',
      handler: 'class-attendance-student.recurring',
    },
    {
      method: 'GET',
      path: '/class-attendance/history',
      handler: 'class-attendance-student.attendanceHistory',
    },
    {
      method: 'GET',
      path: '/class-attendance/current',
      handler: 'class-attendance-student.currentAttendance',
    }
  ]
};