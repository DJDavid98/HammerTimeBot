import {config} from 'dotenv';
import moment from 'moment-timezone';

config({path: '.env.example'});

const latestTimezoneData = require('moment-timezone/data/packed/latest.json');
moment.tz.load(latestTimezoneData);

