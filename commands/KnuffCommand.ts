import {
    IRead,
    IModify,
    IHttp,
    IPersistence,
} from "@rocket.chat/apps-engine/definition/accessors";
import {
    ISlashCommand,
    SlashCommandContext,
} from "@rocket.chat/apps-engine/definition/slashcommands";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { RoomType } from "@rocket.chat/apps-engine/definition/rooms";

export class KnuffCommand implements ISlashCommand {
    public command = "knuff";
    public i18nDescription = "Skicka en knuff till någon";
    public providesPreview = false;
    public i18nParamsExample = "@användare";

    constructor(private readonly app: App) {}

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persis: IPersistence
    ): Promise<void> {
        const sender = context.getSender();
        const room = context.getRoom();
        const args = context.getArguments();

        let targetUser;
        let targetUsername: string;

        if (!args[0]) {
            // No argument - check if we're in a DM
            if (room.type === RoomType.DIRECT_MESSAGE && room.usernames) {
                // Find the other username in the DM
                const otherUsername = room.usernames.find(u => u !== sender.username);
                if (otherUsername) {
                    targetUser = await read.getUserReader().getByUsername(otherUsername);
                }
                
                if (!targetUser) {
                    const msg = modify.getCreator().startMessage();
                    msg.setRoom(room);
                    msg.setText("Kunde inte hitta den andra personen.");
                    await modify.getNotifier().notifyUser(sender, msg.getMessage());
                    return;
                }
            } else {
                const msg = modify.getCreator().startMessage();
                msg.setRoom(room);
                msg.setText("Användning: `/knuff @användarnamn` eller använd i ett DM.");
                await modify.getNotifier().notifyUser(sender, msg.getMessage());
                return;
            }
        } else {
            targetUsername = args[0].replace(/^@/, "");
            targetUser = await read.getUserReader().getByUsername(targetUsername);

            if (!targetUser) {
                const msg = modify.getCreator().startMessage();
                msg.setRoom(room);
                msg.setText(`Kunde inte hitta användare: ${targetUsername}`);
                await modify.getNotifier().notifyUser(sender, msg.getMessage());
                return;
            }
        }

        const builder = modify.getCreator().startMessage();
        builder.setRoom(room);
        builder.setSender(sender);
        builder.setText(`:nudge: ${sender.username} knuffade @${targetUser.username}`);

        await modify.getCreator().finish(builder);
    }
}
