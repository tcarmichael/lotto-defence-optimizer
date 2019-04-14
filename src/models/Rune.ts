import { IStats, Stats } from './Stats';

export interface IRune {
    baseStats: IStats;
    enchantLevel: number;
    awakeningStage: AwakeningStage;
    sp: number;

    getStats(): IStats;
    hasMultiCrit(): boolean;
    hasDamageReduction(): boolean;
    hasUnitAcceleration(): boolean;
}

export enum RuneOptions {
    Unknown,
    MultiCrit,
    CritDamage,
    Acceleration,
    ArmorDecrease,
    BaseCrit,
    UpgradeChance,
    RaceUpgrades,
    DebuffRemoval,
    TotemAttackDamage,
}

export enum AwakeningStage {
    None,
    A,
    B,
    C,
    D,
}

export class Rune implements IRune {
    public baseStats: IStats = new Stats();
    public enchantLevel = 0;
    public awakeningStage: AwakeningStage = AwakeningStage.None;
    public options: RuneOptions[] = [RuneOptions.Unknown, RuneOptions.Unknown];
    public sp: number;

    public getStats(): IStats {
        const newStats: IStats = Object.create(this.baseStats);
        if (newStats.critDamage > 0) {
            newStats.critDamage += this.enchantLevel;
        }

        // Skill damage is unchanged.
        newStats.attackDamage += this.enchantLevel
            + (this.awakeningStage >= AwakeningStage.A ? newStats.attackDamage : 0)
            + (this.hasAttackDamage() ? 15 : 0);
        newStats.attackSpeed += this.enchantLevel
            + (this.awakeningStage >= AwakeningStage.B ? newStats.attackSpeed : 0);
        newStats.critDamage += (this.awakeningStage >= AwakeningStage.D ? 30 : 0)
            + (this.hasCritDamage() ? 50 : 0);
        newStats.critChance += this.enchantLevel
            + (this.hasCritChance() ? newStats.critChance : 0);

        return newStats;
    }

    public getSp(): number {
        const sp: number = this.sp
            + (this.sp > 0 && this.enchantLevel >= 9 ? 5 : 0);
        return sp;
    }

    public hasMultiCrit(): boolean {
        return this.options.includes(RuneOptions.MultiCrit);
    }

    public hasDamageReduction(): boolean {
        return this.options.includes(RuneOptions.ArmorDecrease);
    }

    public hasUnitAcceleration(): boolean {
        return this.options.includes(RuneOptions.Acceleration);
    }

    public hasAttackDamage(): boolean {
        return this.options.includes(RuneOptions.TotemAttackDamage);
    }

    public hasCritDamage(): boolean {
        return this.options.includes(RuneOptions.CritDamage);
    }

    public hasCritChance(): boolean {
        return this.options.includes(RuneOptions.BaseCrit);
    }
}
