export interface IBotLog {
    discordUserId: string;
    discordUsername: string;
    commandName: string;
    guildId: string;
    message: string;
}

export interface IBotOwner {
    guildId: string;
    discordUserId: string;
}

export interface IBotRole {
    guildId: string;
    roleId: string;
    commandName: string;
}
