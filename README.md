
# Ravens Discord.js

## Overview
Ravens is a versatile Discord.js bot designed for moderating your Discord server. It supports multiple languages (English, Portuguese, and Spanish) through both prefix and slash commands. The default prefix is \`!\`.

## Features

### Moderation Commands
1. **Warn**
    - Usage: \`!warn @user [reason]\` or \`/warn @user [reason]\`
    - Warns a user with an optional reason for their behavior.

2. **Modlogs**
    - Usage: \`!modlogs @user\` or \`/modlogs @user\`
    - Displays the moderation logs for a specific user.

3. **Ping**
    - Usage: \`!ping\` or \`/ping\`
    - Checks the bot's latency in milliseconds.

## Language Support
The bot supports commands in the following languages:
- 🇬🇧 English
- 🇵🇹 Portuguese
- 🇪🇸 Spanish

## Usage
To use Ravens, simply invite it to your server and start moderating using the provided commands. You can customize the prefix by changing it in the bot configuration or using the \`prefix\` command.

## Installation
1. Clone the repository to your local machine.
2. Install the required dependencies using \`npm install\`.
3. Configure your bot token and MongoDB connection string in the \`.env\` file.

| Key               | Value                                            |
| ----------------- | ---------------------------------------------------------------- |
| clientToken       | YOUR_DISCORD_BOT_TOKEN |
| dataBase          | YOUR_MONGODB_CONNECTION_STRING |
| defaultPrefix       | ! |
| defaultUserLang       | enus |

4. Run the bot using \`node bot.js\`.

## Configuration
- **Prefix**: The default prefix is \`!\`, but you can change it by modifying the \`defaultPrefix\` in the \`.env\` file.

## Contributions
Contributions are welcome! If you have any suggestions or improvements, feel free to open an issue or submit a pull request.

## Support
If you encounter any issues or have questions, please [open an issue](https://github.com/IHeenrique/Ravens-Mod/issues).

## License
This project is licensed under the [Apache-2.0 License](https://github.com/IHeenrique/Ravens-Mod/blob/main/LICENSE).
