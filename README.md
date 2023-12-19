# INSTALLATION

-   Run `yarn`
-   Get your discord bot token from the [Discord Developers Webpage](https://discord.com/developers/applications)
-   Rename the `.env.example` file to `.env` and fill it
-   Get your service account key from Firebase and add it to `./src/serviceAccountKey.json`
-   Join the bot to your discord server
-   And if you want to test the commands before publishing it globally, it is recommended that you set the `GUILDID` var in the `.env`, otherwise the bot will automatically publish them globally (and that can take 1 hour sometimes because of the discord servers)

# COMMANDS

Three commands are built in, `/botadmin owner`, `/botadmin admin` and `/botadmin role`

## /botadmin owner

This allows you to add additional owners, these are super users that can access any command

## /botadmin role

This allows you to add a specific role to a command. Users with this role can access the command. To assign a command to a role, use `roles_req: "commandName",`
