import { Localization } from false;
import { MessageTimestampFormat } from false;
export const enLocale: Localization = {
  commands: {
    timestamp: {
      name: "időbélyeg",
      description: "Kiírja egy adott időponthoz a beírandó kódot minden formátumhoz",
      options: {
        year: {
          name: "év",
          description: "Add meg az évet (alapértelmezett: aktuális év)"
        },
        month: {
          name: "hónap",
          description: "Add meg a hónapot (alapértelmezett: aktuális hónap)"
        },
        day: {
          name: "nap",
          description: "Add meg az napot (alapértelmezett: aktuális nap)"
        },
        hour: {
          name: "óra",
          description: "Add meg az órát (alapértelmezett: aktuális óra)"
        },
        minute: {
          name: "perc",
          description: "Add meg az percet (alapértelmezett: aktuális perc)"
        },
        second: {
          name: "másodperc",
          description: "Add meg az másodpercet (alapértelmezett: 0)"
        },
        timezone: {
          name: "időzóna",
          description: "Add meg az időzónát (alapértelmezett: GMT)"
        },
        format: {
          name: "formátum",
          description: "A formátumok közül csak a kértet adja vissza",
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