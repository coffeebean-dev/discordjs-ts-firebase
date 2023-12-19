import Bot from "../../structures/Bot";
import { MySlashCommand } from "../../types";
import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { adminSubcommand } from "./subcommands/botadmin/admin";
import { ownerSubcommand } from "./subcommands/botadmin/owner";
import { roleSubcommand } from "./subcommands/botadmin/role";

export default {
    data: new SlashCommandBuilder()
        .setName("botadmin")
        .setDescription("Admin Functions")
        .addSubcommand((subcommand) => adminSubcommand().values(subcommand))
        .addSubcommand((subcommand) => ownerSubcommand().values(subcommand))
        .addSubcommand((subcommand) => roleSubcommand().values(subcommand)),
    onlyOwners: true,
    async run(
        interaction: CommandInteraction<CacheType> & {
            client: Bot;
        }
    ) {
        // @ts-ignore
        if (interaction.options.getSubcommand() === "admin") {
            await adminSubcommand().run(interaction);
        }
        // @ts-ignore
        if (interaction.options.getSubcommand() === "owner") {
            await ownerSubcommand().run(interaction);
        }
        // @ts-ignore
        if (interaction.options.getSubcommand() === "role") {
            await roleSubcommand().run(interaction);
        }
    },
} as MySlashCommand;
