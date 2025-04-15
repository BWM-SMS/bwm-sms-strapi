/**
 * class-attendance-student service
 * https://docs.strapi.io/dev-docs/api/document-service#create
 * https://docs.strapi.io/dev-docs/api/rest/interactive-query-builder
 * Note: Filter if its was a array, its required to use filters at the next level
 */

import { DateTime } from '../../../utils/datetime';
import { Notification } from '../../../utils/notification';

const { createCoreService: createCoreServiceUserNotification } = require('@strapi/strapi').factories;

module.exports = {
  async notifyClassStartSoonService() {
    try {
      const now = new Date();

      const currentDateString = DateTime.getDateString(now);
      const currentTimeString = DateTime.getTimeString(now);

      const nowMinus = DateTime.subtractDurationFromTime(currentTimeString, 2, false);
      const nowPlus = DateTime.addDurationToTime(currentTimeString, 15, false);

      // Find classes starting within next 15 minutes, only for today
      const classAttendance = await strapi.entityService.findMany('api::class-attendance.class-attendance', {
        filters: {
          startTime: {
            $gte: nowMinus,
            $lte: nowPlus
          },
          // Optional: filter by today explicitly
          date: {
            $eq: currentDateString
          }
        },
        fields: ['date', 'startTime', 'endTime'],
        populate: {
          classAttendanceDetails: {
            fields: ['position', 'isAttend'],
            populate: {
              username: {
                fields: ['englishName'],
                populate: {
                  notificationServices: {
                    fields: ['payload']
                  }
                }
              }
            }
          }
        }
      });

      // Define the type for session to include classAttendanceDetails
      type Session = {
        id: string;
        documentId: string;
        date?: string;
        startTime?: string;
        endTime?: string;
        classAttendanceDetails?: Array<{
          position: string;
          isAttend: boolean;
          username: {
            englishName: string;
            notificationServices: {
              payload: any;
            }[];
          };
        }>;
      };

      // Loop through the sessions and send notification if not attended
      for (const attendance of classAttendance as Session[]) {
        for (const attendanceDetail of attendance.classAttendanceDetails || []) {
          for (const token of attendanceDetail.username.notificationServices) {
            let title = '',
              notificationMessage = '';
            // Check if the user is not attended
            if (attendanceDetail.position === 'D. 学员' && attendanceDetail.isAttend === false) {
              title = 'It’s Time to Mark Your Attendance';
              const messages = [
                `Hi ${attendanceDetail.username.englishName}, don’t forget to take your attendance for today’s class!`,
                `Please mark your attendance now – it only takes a second!`,
                `Your class is starting soon. Make sure to check in through the portal!`,
                `Attendance matters! Submit yours now before class begins.`
              ];
              notificationMessage = messages[Math.floor(Math.random() * messages.length)];
            }

            // if Cadre remind to take attendance
            if (attendanceDetail.position !== 'D. 学员') {
              title = 'Don’t Forget to Record Attendance';
              const messages = [
                `Hey ${attendanceDetail.username.englishName}, your class is starting soon. Please take attendance for your group.`,
                `Quick reminder to record today’s attendance in the portal.`,
                `Your class is beginning. Kindly confirm and submit the attendance.`,
                `It’s attendance time! Ensure your group’s records are complete.`
              ];
              notificationMessage = messages[Math.floor(Math.random() * messages.length)];
            }

            // Send notification
            Notification.pushNotification(token.payload, title, notificationMessage);
          }
        }
      }

      return { message: "Attendance notify successful." }
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  }
};
