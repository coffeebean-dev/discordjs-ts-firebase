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

export interface IBotPermission {
    guildId: string;
    roleId: string;
    commandName: string;
}
