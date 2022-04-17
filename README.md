# HammerTimeBot ![Workflow status](https://github.com/DJDavid98/HammerTimeBot/workflows/Build/badge.svg) <a title="Crowdin" target="_blank" href="https://crowdin.com/project/hammertimebot"><img src="https://badges.crowdin.net/hammertimebot/localized.svg" alt=""></a></h1>

Chat bot written in Node.js (using [discord.js](https://www.npmjs.com/package/discord.js)) for [HammerTime]

[HammerTime]: https://github.com/DJDavid98/HammerTime

```
$ sudo npm install -g pm2
$ npm install
$ cp .env.example .env
$ nano .env # Fill in the neccessary environment variables
$ npm build
$ pm2 start pm2.json
```

## Translation

New language contributions are welcome! They are handled through [Crowdin]. If you don't see your language listed,
[join our Discord server] and ask for your language to be added to the project in the [#translator-signup] channel. You
will be given the Translator role and granted access to a language-specific channel for further discussion. This is
necessary so that when new translations are needed for any potential new site features, I have an easy way to reach
everyone at once.

[crowdin]: https://crowdin.com/project/hammertimebot

[join our discord server]: https://hammertime.cyou/discord

[#translator-signup]: https://discord.com/channels/952258283882819595/952292965211074650

English and Hungarian translations have been included, so no translators will be needed for these two languages.
