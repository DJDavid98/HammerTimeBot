import {
  Localization,
  TimestampAgoSubcommandOptionName, TimestampAtSubcommandOptionName, TimestampInSubcommandOptionName,
  TimestampCommandOptionName,
} from '../types/localization.js';
import { MessageTimestampFormat } from '../utils/message-timestamp.js';

export const locale: Localization = {
  commands: {
    timestamp: {
      name: 'timestamp',
      description: 'Can be used to generate the code for timestamps in all formats',
      options: {},
      responses: {
        invalidDate: 'The specified date is invalid (for example: the given day does not exist)',
      },
    },
    [TimestampCommandOptionName.AGO]: {
      name: 'ago',
      description: 'Specify a timestamp in the past relative to the current time',
      responses: {},
      options: {
        [TimestampAgoSubcommandOptionName.YEARS_AGO]: {
          name: 'years',
          description: 'How many years to subtract from the current time',
        },
        [TimestampAgoSubcommandOptionName.MONTHS_AGO]: {
          name: 'months',
          description: 'How many months to subtract from the current time',
        },
        [TimestampAgoSubcommandOptionName.DAYS_AGO]: {
          name: 'days',
          description: 'How many days to subtract from the current time',
        },
        [TimestampAgoSubcommandOptionName.HOURS_AGO]: {
          name: 'hours',
          description: 'How many hours to subtract from the current time',
        },
        [TimestampAgoSubcommandOptionName.MINUTES_AGO]: {
          name: 'minutes',
          description: 'How many minutes to subtract from the current time',
        },
        [TimestampAgoSubcommandOptionName.SECONDS_AGO]: {
          name: 'seconds',
          description: 'How many seconds to subtract from the current time',
        },
      },
    },
    [TimestampCommandOptionName.IN]: {
      name: 'in',
      description: 'Specify a timestamp in the future relative to the current time',
      responses: {},
      options: {
        [TimestampInSubcommandOptionName.IN_YEARS]: {
          name: 'years',
          description: 'How many years to add to the current time',
        },
        [TimestampInSubcommandOptionName.IN_MONTHS]: {
          name: 'months',
          description: 'How many months to add to the current time',
        },
        [TimestampInSubcommandOptionName.IN_DAYS]: {
          name: 'days',
          description: 'How many days to add to the current time',
        },
        [TimestampInSubcommandOptionName.IN_HOURS]: {
          name: 'hours',
          description: 'How many hours to add to the current time',
        },
        [TimestampInSubcommandOptionName.IN_MINUTES]: {
          name: 'minutes',
          description: 'How many minutes to add to the current time',
        },
        [TimestampInSubcommandOptionName.IN_SECONDS]: {
          name: 'seconds',
          description: 'How many seconds to add to the current time',
        },
      },
    },
    [TimestampCommandOptionName.AT]: {
      name: 'at',
      description: 'Specify the exact components of the timestamp (including the timezone)',
      responses: {},
      options: {
        [TimestampAtSubcommandOptionName.YEAR]: {
          name: 'year',
          description: 'Specify the year (defaults to current year)',
        },
        [TimestampAtSubcommandOptionName.MONTH]: {
          name: 'month',
          description: 'Specify the month (defaults to current month)',
        },
        [TimestampAtSubcommandOptionName.DAY]: {
          name: 'day',
          description: 'Specify the day (defaults to current day)',
        },
        [TimestampAtSubcommandOptionName.HOUR]: {
          name: 'hour',
          description: 'Specify the hour (defaults to current hour)',
        },
        [TimestampAtSubcommandOptionName.MINUTE]: {
          name: 'minute',
          description: 'Specify the minute (defaults to current minute)',
        },
        [TimestampAtSubcommandOptionName.SECOND]: {
          name: 'second',
          description: 'Specify the second (defaults to 0)',
        },
        [TimestampAtSubcommandOptionName.TIMEZONE]: {
          name: 'timezone',
          description: 'Specify the timezone (defaults to GMT)',
        },
        [TimestampAtSubcommandOptionName.FORMAT]: {
          name: 'format',
          description: 'Returns only the specified format in the response',
          choices: {
            [MessageTimestampFormat.SHORT_DATE]: 'short date',
            [MessageTimestampFormat.LONG_DATE]: 'long date',
            [MessageTimestampFormat.SHORT_TIME]: 'short time',
            [MessageTimestampFormat.LONG_TIME]: 'long time',
            [MessageTimestampFormat.SHORT_FULL]: 'date and time',
            [MessageTimestampFormat.LONG_FULL]: 'weekday, date and time',
            [MessageTimestampFormat.RELATIVE]: 'relative',
          },
        },
      },
    },
  },
};
