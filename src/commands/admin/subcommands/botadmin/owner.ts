import {
    CacheType,
    CommandInteraction,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import Bot from "../../../../structures/Bot";
import { IBotOwner } from "../../../../documents/types";
import { WriteResult } from "firebase-admin/firestore";
import { db } from "../../../../firebase";

export const ownerSubcommand = () => {
    return {
        values: (subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName("owner")
                .setDescription("Add/Remove user as owner of the bot")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user to add/remove as owner")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("type")
                        .setDescription("Add or remove an owner")
                        .addChoices(
                            { name: "Add", value: "add" },
                            {
                                name: "Remove",
                                value: "remove",
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
            if (interaction.options.getString("type") === "add") {
                await interaction.deferReply({ ephemeral: true });

                const owner: IBotOwner = {
                    discordUserId: interaction.user.id,
                    guildId: interaction.guildId as string,
                };

                db.collection("bot_owners").add(owner);

                await interaction.editReply({
                    content: `${interaction.options.getUser(
                        "user"
                    )} has been added as an owner`,
                });
                // @ts-ignore
            } else if (interaction.options.getString("type") === "remove") {
                await interaction.deferReply({ ephemeral: true });

                const ownerQuery = db
                    .collection("bot_owners")
                    .where(
                        "discordUserId",
                        "==",
                        interaction.options.getUser("user")?.id
                    )
                    .where("guildId", "==", interaction.guildId as string);

                const querySnapshot = await ownerQuery.get();

                // Iterate through the query results and delete each document
                const deletionPromises: Promise<WriteResult>[] = [];
                querySnapshot.forEach((doc) => {
                    const deletePromise = doc.ref.delete();
                    deletionPromises.push(deletePromise);
                });

                // Wait for all deletion promises to complete
                await Promise.all(deletionPromises);

                await interaction.editReply({
                    content: `${interaction.options.getUser(
                        "user"
                    )} has been removed as an owner`,
                });
            }
        },
    };
};
