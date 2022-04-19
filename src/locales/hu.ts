import {
  Localization,
  TimestampAgoSubcommandOptionName,
  TimestampAtSubcommandOptionName, TimestampInSubcommandOptionName,
  TimestampCommandOptionName,
} from '../types/localization.js';
import { BotCommandName } from '../bot-interaction-types.js';
import { MessageTimestampFormat } from '../utils/message-timestamp.js';

export const locale: Localization = {
  commands: {
    [BotCommandName.TIMESTAMP]: {
      name: 'időbélyeg',
      description: 'Kiírja egy adott időponthoz a beírandó kódot minden formátumban',
      responses: {
        invalidDate: 'A megadott dátum érvénytelen (például: az adott nap nem létezik)',
      },
      options: {},
    },
    [TimestampCommandOptionName.AGO]: {
      name: 'ezelőtt',
      description: 'Viszonylagos múltbeli időpont meghatározása az aktuális időhöz képest',
      responses: {},
      options: {
        [TimestampAgoSubcommandOptionName.YEARS_AGO]: {
          name: 'évvel',
          description: 'Hány évet kell kivonni az aktuális időből',
        },
        [TimestampAgoSubcommandOptionName.MONTHS_AGO]: {
          name: 'hónappal',
          description: 'Hány hónapot kell kivonni az aktuális időből',
        },
        [TimestampAgoSubcommandOptionName.DAYS_AGO]: {
          name: 'nappal',
          description: 'Hány napot kell kivonni az aktuális időből',
        },
        [TimestampAgoSubcommandOptionName.HOURS_AGO]: {
          name: 'órával',
          description: 'Hány órát kell kivonni az aktuális időből',
        },
        [TimestampAgoSubcommandOptionName.MINUTES_AGO]: {
          name: 'perccel',
          description: 'Hány percet kell kivonni az aktuális időből',
        },
        [TimestampAgoSubcommandOptionName.SECONDS_AGO]: {
          name: 'másodperccel',
          description: 'Hány másodpercet kell kivonni az aktuális időből',
        },
      },
    },
    [TimestampCommandOptionName.IN]: {
      name: 'múlva',
      description: 'Viszonylagos jövőbeli időpont meghatározása az aktuális időhöz képest',
      responses: {},
      options: {
        [TimestampInSubcommandOptionName.IN_YEARS]: {
          name: 'év',
          description: 'How many years to add to the current time',
        },
        [TimestampInSubcommandOptionName.IN_MONTHS]: {
          name: 'hónap',
          description: 'How many months to add to the current time',
        },
        [TimestampInSubcommandOptionName.IN_DAYS]: {
          name: 'nap',
          description: 'How many days to add to the current time',
        },
        [TimestampInSubcommandOptionName.IN_HOURS]: {
          name: 'óra',
          description: 'How many hours to add to the current time',
        },
        [TimestampInSubcommandOptionName.IN_MINUTES]: {
          name: 'perc',
          description: 'How many minutes to add to the current time',
        },
        [TimestampInSubcommandOptionName.IN_SECONDS]: {
          name: 'másodperc',
          description: 'How many seconds to add to the current time',
        },
      },
    },
    [TimestampCommandOptionName.AT]: {
      name: 'ekkor',
      description: 'Add meg az időbélyeg pontos részeit (az időzónát beleértve)',
      responses: {},
      options: {
        [TimestampAtSubcommandOptionName.YEAR]: {
          name: 'év',
          description: 'Add meg az évet (alapértelmezett: aktuális év)',
        },
        [TimestampAtSubcommandOptionName.MONTH]: {
          name: 'hónap',
          description: 'Add meg a hónapot (alapértelmezett: aktuális hónap)',
        },
        [TimestampAtSubcommandOptionName.DAY]: {
          name: 'nap',
          description: 'Add meg az napot (alapértelmezett: aktuális nap)',
        },
        [TimestampAtSubcommandOptionName.HOUR]: {
          name: 'óra',
          description: 'Add meg az órát (alapértelmezett: aktuális óra)',
        },
        [TimestampAtSubcommandOptionName.MINUTE]: {
          name: 'perc',
          description: 'Add meg az percet (alapértelmezett: aktuális perc)',
        },
        [TimestampAtSubcommandOptionName.SECOND]: {
          name: 'másodperc',
          description: 'Add meg az másodpercet (alapértelmezett: 0)',
        },
        [TimestampAtSubcommandOptionName.TIMEZONE]: {
          name: 'időzóna',
          description: 'Add meg az időzónát (alapértelmezett: GMT)',
        },
        [TimestampAtSubcommandOptionName.FORMAT]: {
          name: 'formátum',
          description: 'A formátumok közül csak a kértet adja vissza',
          choices: {
            [MessageTimestampFormat.SHORT_DATE]: 'rövid dátum',
            [MessageTimestampFormat.LONG_DATE]: 'hosszú dátum',
            [MessageTimestampFormat.SHORT_TIME]: 'rövid idő',
            [MessageTimestampFormat.LONG_TIME]: 'hosszú idő',
            [MessageTimestampFormat.SHORT_FULL]: 'dátum és idő',
            [MessageTimestampFormat.LONG_FULL]: 'hét napja, dátum és idő',
            [MessageTimestampFormat.RELATIVE]: 'viszonylagos',
          },
        },
      },
    },
  },
};
