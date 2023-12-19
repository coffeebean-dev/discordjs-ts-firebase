import Bot from "./structures/Bot";
import { IntentsBitField, Partials, PresenceUpdateStatus } from "discord.js";
import { config } from "dotenv";

config();

(async () => {
    const bot = new Bot({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent,
            IntentsBitField.Flags.GuildMembers,
            IntentsBitField.Flags.GuildMessageReactions,
        ],
        partials: [Partials.Message],
        presence: { status: PresenceUpdateStatus.DoNotDisturb },
        // allowedMentions: { parse: ['everyone', 'roles', 'users'] },
    });

    Promise.all([bot.init(process.env.TOKEN as string)]);
})();
