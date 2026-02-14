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

        if (!args[0]) {
            // No argument - try to auto-detect in DM
            if (room.type === RoomType.DIRECT_MESSAGE) {
                // Try userIds first
                if (room.userIds) {
                    const otherUserId = room.userIds.find(id => id !== sender.id);
                    if (otherUserId) {
                        // Try getById first, then fall back to getByUsername
                        // (RC sometimes stores usernames in userIds array)
                        targetUser = await read.getUserReader().getById(otherUserId);
                        if (!targetUser) {
                            targetUser = await read.getUserReader().getByUsername(otherUserId);
                        }
                    }
                }

                // Fallback: try to get usernames from room members
                if (!targetUser) {
                    const members = await read.getRoomReader().getMembers(room.id);
                    if (members) {
                        for (const member of members) {
                            if (member.id !== sender.id) {
                                targetUser = member;
                                break;
                            }
                        }
                    }
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
