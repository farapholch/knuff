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

export class NudgeCommand implements ISlashCommand {
    public command = "nudge";
    public i18nDescription = "Send a nudge to someone";
    public providesPreview = false;
    public i18nParamsExample = "@username";

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

        if (!args[0]) {
            // No argument - try to auto-detect in DM
            if (room.type === RoomType.DIRECT_MESSAGE && room.userIds) {
                // Use userIds instead of usernames (more reliable)
                const otherUserId = room.userIds.find(id => id !== sender.id);
                if (otherUserId) {
                    targetUser = await read.getUserReader().getById(otherUserId);
                }

                if (!targetUser) {
                    const msg = modify.getCreator().startMessage();
                    msg.setRoom(room);
                    msg.setText("Kunde inte hitta den andra personen i konversationen.");
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
            const targetUsername = args[0].replace(/^@/, "");
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
