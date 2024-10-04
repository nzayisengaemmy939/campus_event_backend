// src/status/status.js

class EventStatus {
    static getEventStatus(date) {
      const currentDate = new Date();
      const startOfDay = new Date(currentDate);
      startOfDay.setHours(0, 0, 0, 0); // Start of today
      const endOfDay = new Date(currentDate);
      endOfDay.setHours(23, 59, 59, 999); // End of today
  
      if (date < startOfDay) {
        return 'Ended';
      } else if (date >= startOfDay && date <= endOfDay) {
        return 'Today';
      } else {
        return 'Coming';
      }
    }
  }
  
  export default EventStatus;
  