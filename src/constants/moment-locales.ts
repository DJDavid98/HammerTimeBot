import 'moment/locale/de';
import 'moment/locale/el';
import 'moment/locale/en-gb';
import 'moment/locale/es';
import 'moment/locale/hu';
import 'moment/locale/it';
import 'moment/locale/ko';
import 'moment/locale/pl';
import 'moment/locale/ru';
import 'moment/locale/uk';

import moment from 'moment-timezone';
import latestTimezoneData from 'moment-timezone/data/packed/latest.json';

moment.tz.load(latestTimezoneData);
moment.relativeTimeThreshold('s', 60);
moment.relativeTimeThreshold('ss', 0);
