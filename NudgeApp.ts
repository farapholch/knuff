import {
    IAppAccessors,
    IConfigurationExtend,
    ILogger,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import { KnuffCommand } from "./commands/KnuffCommand";
import { NudgeCommand } from "./commands/NudgeCommand";

export class NudgeApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async extendConfiguration(configuration: IConfigurationExtend): Promise<void> {
        await configuration.slashCommands.provideSlashCommand(new KnuffCommand(this));
        await configuration.slashCommands.provideSlashCommand(new NudgeCommand(this));
    }
}
