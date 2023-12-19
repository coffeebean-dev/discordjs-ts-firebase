import {
    CacheType,
    CommandInteraction,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import Bot from "../../../../structures/Bot";

export const adminSubcommand = () => {
    return {
        values: (subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName("admin")
                .setDescription("Various admin commands")
                .addStringOption((option) =>
                    option
                        .setName("type")
                        .setDescription("Type of admin command")
                        .addChoices(
                            { name: "ping", value: "ping" },
                            {
                                name: "reload",
                                value: "reload",
                            }
                        )
                        .setRequired(true)
                ),
        run: async (
            interaction: CommandInteraction<CacheType> & {
                client: Bot;
            }
        ) => {
            // @ts-ignore
            if (interaction.options.getString("type") === "ping") {
                await interaction.deferReply({ ephemeral: true });

                await interaction.editReply({
                    content: `Pong! ${interaction.client.ws.ping}ms`,
                });
                // @ts-ignore
            } else if (interaction.options.getString("type") === "reload") {
                await interaction.deferReply({ ephemeral: true });

                const confirm =
                    await interaction.client.utils.confirmationCheck(
                        interaction,
                        "Are you sure to reload the commands and events?"
                    );

                if (!confirm) {
                    interaction.deleteReply();
                    return;
                }

                await interaction.editReply({
                    content: `Reloading files, please wait...`,
                });

                await Promise.allSettled([
                    interaction.client.loadEvents(),
                    interaction.client.loadCommands(),
                ]);
                await interaction.client.utils.summitCommands();

                await interaction.editReply({
                    content: `File reload finished.`,
                });
            }
        },
    };
};
