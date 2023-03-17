import { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from "discord.js";
import { TFunction } from "i18next";
import { SnowflakeCommandOptionName } from "../types/localization.js";
import { getLocalizedObject } from "../utils/get-localized-object.js";
import { getGlobalOptions } from "./global.options.js";

export const getSnowflakeCommandOptions = (t: TFunction): APIApplicationCommandBasicOption[] => [
    {
        name: SnowflakeCommandOptionName.VALUE,
        ...getLocalizedObject('name', (lng) => t('commands.snowflake.options.value.name', { lng }), false),
        ...getLocalizedObject('description', (lng) => t('commands.snowflake.options.value.description', { lng })),
        type: ApplicationCommandOptionType.String,
        required: true,
    },
    ...getGlobalOptions(t),
];