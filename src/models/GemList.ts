import { EnvironmentConstants } from '../constants/EnvironmentConstants';
import { IStats, Stats } from './Stats';

export interface IGemList {
    selectedGems: Gem[];

    calcStats(experience: number): IStats;
}

export enum Gem {
    EasyRank,
    Donation,
    Helper,
    OverUpgrade,
    GasBank,
    DoubleCard,
    HorseMaster,
    Starter,
    Silence,
    AP,
    PowerBanker,
    AirBus,
    Sxd,
    Slow,
    MultiRaptor,
    Party,
    Meteor,
    Artifact,
    Sheriff,
    Starforce,
    BlackHole,
    ShieldOff,
    LimitDestroy,
    EasyRankPlus,
    OverUpgradePlus,
    GasBankPlus,
    DoubleCardPlus,
    HorseMasterPlus,
    HelperPlus,
    MultiRaptorPlus,
    SxdPlus,
    AlphaSoloCrit,
    Stimpack,
    GasReturn,
    ShieldMaster,
}

export class GemList implements IGemList {
    public selectedGems: Gem[] = [];

    public calcStats(experience: number): IStats {
        const stats: IStats = new Stats();

        // Starter gem.
        let starterGemBonus: number = (this.hasStarter()) ? EnvironmentConstants.STARTER_GEM_STATS : 0;
        if (experience < EnvironmentConstants.STARTER_GEM_EXPERIENCE) {
            starterGemBonus *= EnvironmentConstants.STARTER_GEM_MULTIPLIER;
        }

        // Power banker gem.
        const powerBankerGemBonus: number = (this.hasPowerBanker()) ? EnvironmentConstants.POWER_BANKER_GEM_STATS : 0;

        stats.attackDamage = starterGemBonus + powerBankerGemBonus;
        stats.attackSpeed = starterGemBonus;

        return stats;
    }

    public hasPowerBanker(): boolean {
        return this.selectedGems.includes(Gem.PowerBanker);
    }

    public hasStarter(): boolean {
        return this.selectedGems.includes(Gem.Starter);
    }
}
