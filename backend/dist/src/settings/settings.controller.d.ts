import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getAll(): Promise<{}>;
    updateMany(req: any, configs: Record<string, string>): Promise<{
        updatedAt: Date;
        key: string;
        value: string;
    }[]>;
}
