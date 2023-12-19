import Discord, { ClientEvents, MessageReaction, User } from "discord.js";
import Bot from "./structures/Bot";

// export interface CommandEvent {
//   name: string;

//   /**
//    * La funcion principal del evento
//    */
//   run(interaction: Discord.Interaction & { client: Bot }): void | Promise<void>;
// }

export interface MyBotEvents<E extends keyof ClientEvents> {
    name: E;

    /**
     * La funcion principal del evento
     */
    run(
        ...args: [ClientEvents[E][number] & { client: Bot }] // FIXME solo funciona si tiene un solo argumento, con el evento roleUpdate no funciona
    ): //
    //   [K in keyof ClientEvents[E]]: { client: Bot } & Omit<
    //     ClientEvents[E][K],
    //     'client'
    //   >;
    // }
    // ...args: {
    // [K in keyof ClientEvents[E]]: ClientEvents[E][K] & { client: Bot };
    // }
    void | Promise<void>;
    // ^?
}

type arreglo = Array<1 | 2>[0];

export interface MyReadyEvent {
    name: "ready";

    run(client: Bot): void | Promise<void>;
}

export interface MyMemberEvent {
    name: string;

    run(member: GuildMember): void | Promise<void>;
}

export interface MyReactionEvent {
    name: string;

    run(reaction: MessageReaction, user: User): void | Promise<void>;
}

export interface MySlashCommand {
    /**
     * List of role ids required to use the command
     */
    roles_req?: string;

    /**
     * List of permissions required to use the command
     */
    perms_req?: Discord.PermissionResolvable[];

    /**
     * If the user is required to have all roles to use the command
     */
    allRoles_req?: boolean;

    /**
     * If the user is required to have full permissions to use the command
     */
    allPerms_req?: boolean;

    /**
     * If the user is required to have the required roles and permissions to use the command
     */
    everthing_req?: boolean;

    /**
     * Convierte el comando unicamente disponible para los owners declarados en el .env
     */
    onlyOwners?: boolean;

    /**
     * Tiempo en ms de enfriamiento del comando por persona
     */
    rateLimit?: number;

    /**
     * Los datos del comando a cargar a discord
     */
    data: Discord.SlashCommandBuilder;

    /**
     * La funcion principal del comando
     */
    run(
        interaction: Discord.CommandInteraction & { client: Bot }
    ): void | Promise<void>;
}

export type SlashCommandsCollection = Discord.Collection<
    string,
    MySlashCommand
>;

export type RateLimits = Discord.Collection<string, Date>;
