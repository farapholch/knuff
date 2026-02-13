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
            if (room.type === RoomType.DIRECT_MESSAGE && room.usernames) {
                const otherUsername = room.usernames.find(u => u !== sender.username);
                if (otherUsername) {
                    targetUser = await read.getUserReader().getByUsername(otherUsername);
                }
                
                if (!targetUser) {
                    const msg = modify.getCreator().startMessage();
                    msg.setRoom(room);
                    msg.setText("Could not find the other person.");
                    await modify.getNotifier().notifyUser(sender, msg.getMessage());
                    return;
                }
            } else {
                const msg = modify.getCreator().startMessage();
                msg.setRoom(room);
                msg.setText("Usage: `/nudge @username` or use in a DM.");
                await modify.getNotifier().notifyUser(sender, msg.getMessage());
                return;
            }
        } else {
            const targetUsername = args[0].replace(/^@/, "");
            targetUser = await read.getUserReader().getByUsername(targetUsername);

            if (!targetUser) {
                const msg = modify.getCreator().startMessage();
                msg.setRoom(room);
                msg.setText(`Could not find user: ${targetUsername}`);
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
