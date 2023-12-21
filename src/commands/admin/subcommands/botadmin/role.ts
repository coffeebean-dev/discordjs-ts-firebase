import {
    CacheType,
    CommandInteraction,
    SlashCommandSubcommandBuilder,
} from "discord.js";
import Bot from "../../../../structures/Bot";
import { IBotRole } from "../../../../documents/types";
import { WriteResult } from "firebase-admin/firestore";
import { db } from "../../../../firebase";

export const roleSubcommand = () => {
    return {
        values: (subcommand: SlashCommandSubcommandBuilder) =>
            subcommand
                .setName("role")
                .setDescription("Add/remove role to command")
                .addRoleOption((option) =>
                    option
                        .setName("role")
                        .setDescription(
                            "The role to add/remove from permission"
                        )
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("command")
                        .setDescription("Command to give permission to")
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("type")
                        .setDescription("Add or remove a role")
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

                const permission: IBotRole = {
                    // @ts-ignore
                    roleId: interaction.options.getRole("role")?.id,
                    guildId: interaction.guildId as string,
                    // @ts-ignore
                    commandName: interaction.options.getString("command"),
                };

                db.collection("bot_roles").add(permission);

                await interaction.editReply({
                    content: `${
                        // @ts-ignore
                        interaction.options.getRole("role").name
                        // @ts-ignore
                    } has been added to ${interaction.options.getString(
                        "command"
                    )}`,
                });
                // @ts-ignore
            } else if (interaction.options.getString("type") === "remove") {
                await interaction.deferReply({ ephemeral: true });

                const permissionQuery = db
                    .collection("bot_roles")
                    .where(
                        "roleId",
                        "==",
                        // @ts-ignore
                        interaction.options.getRole("role")?.id
                    )
                    .where("guildId", "==", interaction.guildId as string)
                    .where(
                        "commandName",
                        "==",
                        // @ts-ignore
                        interaction.options.getString("command")
                    );

                const querySnapshot = await permissionQuery.get();

                // Iterate through the query results and delete each document
                const deletionPromises: Promise<WriteResult>[] = [];
                querySnapshot.forEach((doc) => {
                    const deletePromise = doc.ref.delete();
                    deletionPromises.push(deletePromise);
                });

                // Wait for all deletion promises to complete
                await Promise.all(deletionPromises);

                await interaction.editReply({
                    content: `${
                        // @ts-ignore
                        interaction.options.getRole("role").name
                        // @ts-ignore
                    } has been removed from ${interaction.options.getString(
                        "command"
                    )}`,
                });
            }
        },
    };
};
