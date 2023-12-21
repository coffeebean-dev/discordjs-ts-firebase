import { GuildMemberRoleManager } from "discord.js";
import { MyBotEvents } from "../types";
import { db } from "../firebase";
import { IBotLog, IBotOwner } from "../documents/types";

export default {
    name: "interactionCreate",

    async run(interaction) {
        if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(
            interaction.commandName
        );

        if (!command) {
            const log: IBotLog = {
                discordUserId: interaction.user.id,
                discordUsername: interaction.user.username,
                guildId: interaction.guildId as string,
                commandName: interaction.commandName,
                message: "Command Not Found",
            };

            db.collection("bot_logs").add(log);

            if (interaction.replied) return;
            try {
                interaction.reply({
                    content:
                        "There was an error trying to find the command\nPlease try again later...",
                    ephemeral: true,
                });
            } catch (error) {}

            return;
        }

        // --NCheckAuth--
        /**
         * Parametros:
         * roles_req = String
         * perms_req = String[]
         * allRoles_req = Boolean
         * allPerms_req = Boolean
         * everthing_req = Boolean
         * onlyOwners = Boolean
         */
        /** Funcion para verificar que el usuario tenga los permisos de utilizar el comando */
        const authPass = async () => {
            const allOwners: string[] = [];

            const ownersRef = db.collection("bot_owners");
            const ownersSnapshot = await ownersRef
                .where("guildId", "==", interaction.guildId)
                .get();

            ownersSnapshot.docs.forEach((item) => {
                const data = item.data() as IBotOwner;
                allOwners.push(data.discordUserId);
            });

            if (process.env.BOT_OWNERS) {
                const bot_owners = process.env.BOT_OWNERS.split(",");
                bot_owners.forEach((item) => {
                    allOwners.push(item);
                });
            }
            if (allOwners?.includes(interaction.user.id)) return 1;
            if (command.onlyOwners) return 0;

            const member =
                interaction.member ??
                (await interaction.guild?.members.fetch(interaction.user.id));

            let rolesCheck = false;

            const permissionsRef = db.collection("bot_roles");
            const roles = await permissionsRef
                .where("guildId", "==", interaction.guildId)
                .where("command", "==", command.roles_req)
                .get();

            const accessRoles = roles.docs.map(function (item) {
                const data = item.data();
                return data.roleId;
            }) as string[];

            // ROLES CHECK
            if (
                command.roles_req &&
                member?.roles instanceof GuildMemberRoleManager
            ) {
                rolesCheck =
                    (!!command.allRoles_req
                        ? member?.roles.cache.hasAll(...accessRoles)
                        : member?.roles.cache.hasAny(...accessRoles)) || false;
            } else rolesCheck = true;

            if (command.everthing_req) {
                if (rolesCheck) return 1;
            } else {
                if (rolesCheck) return 1;
            }

            return 0;
        };

        if (!(await authPass())) {
            const log: IBotLog = {
                discordUserId: interaction.user.id,
                discordUsername: interaction.user.username,
                guildId: interaction.guildId as string,
                commandName: interaction.commandName,
                message: "Unauthorized",
            };

            db.collection("bot_logs").add(log);

            interaction.client.utils.embedReply(interaction, {
                color: "Red",
                author: { name: "⛔ Forbidden" },
                description:
                    "```\n \n" +
                    `> ${interaction.user.username}\n` +
                    "You do not have permissions to use this command.\n \n```",
            });
            return;
        }
        // --NCheckAuth--

        // --RateLimiter--
        const identifier = `${interaction.commandName}-${interaction.user.id}`;

        let allOwners: string[] = [];

        const ownersRef = db.collection("bot_owners");
        const ownersSnapshot = await ownersRef
            .where("guildId", "==", interaction.guildId)
            .get();

        ownersSnapshot.docs.forEach((item) => {
            const data = item.data() as IBotOwner;
            allOwners.push(data.discordUserId);
        });

        if (process.env.BOT_OWNERS) {
            const bot_owners = process.env.BOT_OWNERS.split(",");
            bot_owners.forEach((item) => {
                allOwners.push(item);
            });
        }

        if (
            !allOwners.includes(interaction.user.id) &&
            !interaction.client.utils.rateLimitCheck(
                identifier,
                command.rateLimit,
                1
            )
        ) {
            const log: IBotLog = {
                discordUserId: interaction.user.id,
                discordUsername: interaction.user.username,
                guildId: interaction.guildId as string,
                commandName: interaction.commandName,
                message: "Exceeded Limit",
            };

            db.collection("bot_logs").add(log);

            interaction.client.utils.embedReply(interaction, {
                color: "Yellow",
                author: { name: "🖐️Espera" },
                description:
                    "```\n \n" +
                    `> ${interaction.user.username}\n` +
                    "You exceeded the limit of executions, try again later.\n \n```",
            });
            return;
        }
        // --RateLimiter--

        const log: IBotLog = {
            discordUserId: interaction.user.id,
            discordUsername: interaction.user.username,
            guildId: interaction.guildId as string,
            commandName: interaction.commandName,
            message: "Command Start",
        };

        db.collection("bot_logs").add(log);

        try {
            await command.run(interaction);
        } catch (error) {
            const log: IBotLog = {
                discordUserId: interaction.user.id,
                discordUsername: interaction.user.username,
                guildId: interaction.guildId as string,
                commandName: interaction.commandName,
                message: "Command Error",
            };

            db.collection("bot_logs").add(log);
            console.log(error);

            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.editReply({
                        content: "There was an  error executing the command.",
                    });
                } else {
                    await interaction.reply({
                        content: "There was an  error executing the command.",
                        ephemeral: true,
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    },
} as MyBotEvents<"interactionCreate">;
