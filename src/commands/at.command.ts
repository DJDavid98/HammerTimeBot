import moment, { Moment } from 'moment-timezone';
import { BotChatInputCommand } from '../types/bot-interaction.js';
import { constrain, getGmtTimezoneValue, gmtZoneRegex } from '../utils/time.js';
import { AtCommandOptionName, GlobalCommandOptionName } from '../types/localization.js';
import { getLocalizedObject } from '../utils/get-localized-object.js';
import { replyWithSyntax } from '../utils/reply-with-syntax.js';
import { getAtOptions } from '../options/at.options.js';
import { ApplicationCommandType } from 'discord-api-types/v10';
import { getSettings } from '../utils/settings.js';
import { findTimezoneOptionValue, handleTimezoneAutocomplete } from '../utils/messaging.js';

export const atCommand: BotChatInputCommand = {
  getDefinition: (t) => ({
    type: ApplicationCommandType.ChatInput,
    ...getLocalizedObject('description', (lng) => t('commands.at.description', { lng })),
    ...getLocalizedObject('name', (lng) => t('commands.at.name', { lng })),
    options: getAtOptions(t),
  }),
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);

    switch (focusedOption.name) {
      case GlobalCommandOptionName.TIMEZONE:
        await handleTimezoneAutocomplete(interaction);
        break;
      default:
        throw new Error(`Unknown autocomplete option ${focusedOption.name}`);
    }
  },
  async handle(interaction, context) {
    const settings = await getSettings(context, interaction);
    const { t } = context;
    const year = interaction.options.getNumber(AtCommandOptionName.YEAR);
    const month = interaction.options.getNumber(AtCommandOptionName.MONTH);
    const date = interaction.options.getNumber(AtCommandOptionName.DATE);
    const hour = interaction.options.getNumber(AtCommandOptionName.HOUR);
    const minute = interaction.options.getNumber(AtCommandOptionName.MINUTE);
    const second = interaction.options.getNumber(AtCommandOptionName.SECOND);

    const timezone = await findTimezoneOptionValue(t, interaction, settings);
    if (timezone === null) {
      return;
    }

    let localMoment: Moment;
    try {
      if (gmtZoneRegex.test(timezone)) {
        const utcOffset = Math.round(constrain(getGmtTimezoneValue(timezone, 0), -16, 16));
        localMoment = moment.tz('UTC').utcOffset(utcOffset);
      } else {
        localMoment = moment.tz(timezone);
      }
      localMoment = localMoment.millisecond(0);
      if (year !== null) localMoment.year(constrain(year, 0, 275759));
      if (month !== null) localMoment.month(constrain(month - 1, 0, 11));
      if (date !== null) localMoment.date(constrain(date, 1, 31));
      if (hour !== null) localMoment.hour(constrain(hour, 0, 23));
      if (minute !== null) localMoment.minute(constrain(minute, 0, 59));
      localMoment.second(second !== null ? constrain(second, 0, 59) : 0);
    } catch (e) {
      if (e instanceof RangeError && e.message === 'Invalid date') {
        await interaction.reply({
          content: t('commands.global.responses.invalidDate'),
          ephemeral: true,
        });
        return;
      }

      throw e;
    }

    await replyWithSyntax({ localMoment, interaction, t, timezone, settings });
  },
};
