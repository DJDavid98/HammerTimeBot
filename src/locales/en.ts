import { Localization } from '../types/localization.js';
import { MessageTimestampFormat } from '../utils/time.js';
export const enLocale: Localization = {
  commands: {
    timestamp: {
      name: 'timestamp',
      description: 'Can be used to generate the code for timestamps is all formats',
      options: {
        year: {
          name: 'year',
          description: 'Specify the year (defaults to current year)'
        },
        month: {
          name: 'month',
          description: 'Specify the month (defaults to current month)'
        },
        day: {
          name: 'day',
          description: 'Specify the day (defaults to current day)'
        },
        hour: {
          name: 'hour',
          description: 'Specify the hour (defaults to current hour)'
        },
        minute: {
          name: 'minute',
          description: 'Specify the minute (defaults to current minute)'
        },
        second: {
          name: 'second',
          description: 'Specify the second (defaults to 0)'
        },
        timezone: {
          name: 'timezone',
          description: 'Specify the timezone (defaults to GMT)'
        },
        format: {
          name: 'format',
          description: 'Returns only the specified format in the response',
          choices: {
            [MessageTimestampFormat.SHORT_DATE]: 'short date',
            [MessageTimestampFormat.LONG_DATE]: 'long date',
            [MessageTimestampFormat.SHORT_TIME]: 'short time',
            [MessageTimestampFormat.LONG_TIME]: 'long time',
            [MessageTimestampFormat.SHORT_FULL]: 'date and time',
            [MessageTimestampFormat.LONG_FULL]: 'weekday, date and time',
            [MessageTimestampFormat.RELATIVE]: 'relative'
          }
        }
      }
    }
  }
};