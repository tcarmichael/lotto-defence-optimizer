import { DIFFICULTY_DATABASE, TORMENT_DATABASE } from '../constants/DifficultyConstants';
import { EnvironmentConstants } from '../constants/EnvironmentConstants';
import { RankConstants } from '../constants/RankConstants';
import { RuneConstants } from '../constants/RuneConstants';
import { IEnvironment } from './Environment';
import { IRune } from './Rune';

export interface IStats {
    attackDamage: number;
    attackSpeed: number;
    critChance: number;
    critDamage: number;
    multiCrit: number;
    finalDamageIncrease: number;
    defenseReduction: number;
    unitAcceleration: number;
    multiHitDamage: number; // md
    multiHitChance: number; // mp
    multiHitCritical: number; // mcp
    etc: number;

    getStat(statType: StatType): number;
    setStat(statType: StatType, value: number): void;
}

export enum StatType {
    AttackDamage,
    AttackSpeed,
    CritChance,
    CritDamage,
    MultiCrit,
    SkillDamage,
    ArmorReduction,
    FinalDamage,
    UnitAcceleration,
    MultiHitDamage,
    MultiHitChance,
    MultiHitCritical,
    Etc,
}

export class Stats implements IStats {
    public attackDamage: number = 0;
    public attackSpeed: number = 0;
    public critChance: number = 0;
    public critDamage: number = 0;
    public multiCrit: number = 0;
    public finalDamageIncrease: number = 0;
    public defenseReduction: number = 0;
    public unitAcceleration: number = 0;
    public multiHitDamage: number = 0; // md
    public multiHitChance: number = 0; // mp
    public multiHitCritical: number = 0; // mcp
    public etc: number = 0;

    constructor(env?: IEnvironment, sp?: IStats, ep?: IStats, gems?: IStats, rune?: IRune) {
        if (env && sp && ep && gems && rune) {
            this.calcStats(env, sp, ep, gems, rune);
        }
    }

    public getStat(statType: StatType): number {
        switch (statType) {
            case StatType.AttackDamage: return this.attackDamage;
            case StatType.AttackSpeed: return this.attackSpeed;
            case StatType.CritChance: return this.critChance;
            case StatType.CritDamage: return this.critDamage;
            case StatType.MultiCrit: return this.multiCrit;
            case StatType.FinalDamage: return this.finalDamageIncrease;
            case StatType.ArmorReduction: return this.defenseReduction;
            case StatType.UnitAcceleration: return this.unitAcceleration;
            case StatType.MultiHitDamage: return this.multiHitDamage;
            case StatType.MultiHitChance: return this.multiHitChance;
            case StatType.MultiHitCritical: return this.multiHitCritical;
            case StatType.Etc: return this.etc;
            default: throw Error('Unknown stat type');
        }
    }

    public setStat(statType: StatType, value: number): void {
        switch (statType) {
            case StatType.AttackDamage: this.attackDamage = value; break;
            case StatType.AttackSpeed: this.attackSpeed = value; break;
            case StatType.CritChance: this.critChance = value; break;
            case StatType.CritDamage: this.critDamage = value; break;
            case StatType.MultiCrit: this.multiCrit = value; break;
            case StatType.FinalDamage: this.finalDamageIncrease = value; break;
            case StatType.ArmorReduction: this.defenseReduction = value; break;
            case StatType.UnitAcceleration: this.unitAcceleration = value; break;
            case StatType.MultiHitDamage: this.multiHitDamage = value; break;
            case StatType.MultiHitChance: this.multiHitChance = value; break;
            case StatType.MultiHitCritical: this.multiHitCritical = value; break;
            case StatType.Etc: this.etc = value; break;
            default: throw Error('Unknown stat type');
        }
    }

    private calcStats(env: IEnvironment, sp: IStats, ep: IStats, gems: IStats, rune: IRune) {
        const runeStats: IStats = rune.getStats();

        // Calculate the final damage before calculating attack damage because it is used
        // in that calculation.
        this.finalDamageIncrease = this.calcFinalDamage(sp);

        this.attackDamage = this.calcAttackDamage(env, sp, ep, gems, runeStats);
        this.attackSpeed = this.calcAttackSpeed(env, sp, ep, gems, runeStats);
        this.critChance = this.calcCritChance(env, sp, ep, runeStats);
        this.critDamage = this.calcCritDamage(env, sp, ep, runeStats);
        this.multiCrit = this.calcMultiCrit(sp, ep, rune);
        this.defenseReduction = this.calcDefenseReduction(sp, ep, rune);
        this.unitAcceleration = this.calcUnitAcceleration(env, sp, rune);
        this.multiHitDamage = this.calcMultiHitDamage(sp);
        this.multiHitChance = this.calcMultiHitChance(sp);
        this.multiHitCritical = this.calcMultiHitCritical(sp);
        this.etc = this.calcEtc(sp);
    }

    private calcAttackDamage(env: IEnvironment, sp: IStats, ep: IStats, gems: IStats, runeStats: IStats): number {
        // Note: This doesn't implement "general sharing buff", "special sharing buff", or monthly gems.
        // Make sure this.finalDamageIncrease is calculated before this function.
        const preCalc: number = 100
            + sp.attackDamage
            + runeStats.attackDamage
            + env.teamAttackDamage
            + env.teamBless
            + (env.selfBless ? EnvironmentConstants.BLESS_DAMAGE : 0)
            + RankConstants.DAMAGE_LOOKUP.get(env.unitRank)
            + env.unitLevel * EnvironmentConstants.UNIT_LEVEL_ATTACK_DAMAGE_MODIFIER
            + (env.flowerAttackDamage ? (EnvironmentConstants.FLOWER_ATTACK_DAMAGE - 1) * 10 : 0)
            + gems.attackDamage
            + (env.haveAmon ? EnvironmentConstants.AMON_ATTACK_DAMAGE : 0)
            + (env.singleUnitBuff ? EnvironmentConstants.SINGLE_UNIT_ATTACK_DAMAGE : 0)
            - (env.duplicateUnitPenalty * EnvironmentConstants.DUPLICATE_UNIT_ATTACK_DAMAGE_PENALTY)
            + (env.useAverageUpgrade ? env.calcAverageUpgrade() : 0)
            - DIFFICULTY_DATABASE.get(env.difficulty).damageDecrease
            + ep.attackDamage
            + RankConstants.LIMIT_BREAK_DAMAGE_LOOKUP[env.limitBreak];

        const tormentModifier: number = TORMENT_DATABASE[env.torments];

        const ad: number = (preCalc) * (1 + this.finalDamageIncrease / 100) * (1 - tormentModifier / 100);
        return ad;
    }

    private calcAttackSpeed(env: IEnvironment, sp: IStats, ep: IStats, gems: IStats, runeStats: IStats): number {
        // Note: This doesn't implement "general sharing buff", "special sharing buff", or monthly gems.
        // My best efforts led me to believe that this isn't implemented in NA.
        const as: number = sp.attackSpeed
            + runeStats.attackSpeed
            + env.teamAttackSpeed
            + gems.attackSpeed
            + (env.haveSpecOps ? EnvironmentConstants.SPEC_OPS_NOVA_ATTACK_SPEED : 0)
            + ep.attackSpeed;
        return as;
    }

    private calcCritChance(env: IEnvironment, sp: IStats, ep: IStats, runeStats: IStats): number {
        // Note: This doesn't implement "daily code", "general sharing buff",
        // "special sharing buff", or "alpha/solo crit gem".
        const cc: number = sp.critChance
            + runeStats.critChance
            + env.teamCritChance
            + (env.haveArtifact ? EnvironmentConstants.ARTIFACT_CRIT_CHANCE : 0)
            + (env.haveTerraTron ? EnvironmentConstants.TERRA_TRON_CRIT_CHANCE : 0)
            + (env.haveXelnagaKerrigan ? EnvironmentConstants.XELNAGA_KERRIGAN_CRIT_CHANCE : 0)
            + ep.critChance;
        return cc;
    }

    private calcCritDamage(env: IEnvironment, sp: IStats, ep: IStats, runeStats: IStats): number {
        // Note: This doesn't implement the January gem.
        const tormentModifier: number = TORMENT_DATABASE[env.torments];

        const cd: number = (1 - tormentModifier / 100) * (100
            + sp.critDamage
            + runeStats.critDamage
            + (env.haveSpearOfAdun ? EnvironmentConstants.SPEAR_OF_ADUN_CRIT_DAMAGE : 0)
            + ep.critDamage);
        return cd;
    }

    private calcMultiCrit(sp: IStats, ep: IStats, rune: IRune): number {
        // Note: This doesn't implement the Party rune.
        const mc: number = sp.multiCrit
            + (rune.hasMultiCrit() ? RuneConstants.MULTI_CRIT_BONUS : 0)
            + ep.multiCrit;
        return mc;
    }

    private calcFinalDamage(sp: IStats) {
        const fd: number = sp.finalDamageIncrease;
        return fd;
    }

    private calcDefenseReduction(sp: IStats, ep: IStats, rune: IRune): number {
        // Note: This doesn't implement awakening stages.
        const dr: number = sp.defenseReduction
            + (rune.hasDamageReduction() ? RuneConstants.DAMAGE_REDUCTION : 0)
            + ep.defenseReduction;
        return dr;
    }

    private calcUnitAcceleration(env: IEnvironment, sp: IStats, rune: IRune): number {
        // Note: This doesn't implement monthly gems.
        const ua: number = sp.unitAcceleration
            * (rune.hasUnitAcceleration() ? RuneConstants.UNIT_ACCELERATION : 1)
            * (1 + RankConstants.LIMIT_BREAK_ACCELERATION_LOOKUP[env.limitBreak] / 100);
        return ua;
    }

    private calcMultiHitDamage(sp: IStats): number {
        const md: number = sp.multiHitDamage;
        return md;
    }

    private calcMultiHitChance(sp: IStats): number {
        const mp: number = sp.multiHitChance;
        return mp;
    }

    private calcMultiHitCritical(sp: IStats): number {
        const mcp: number = sp.multiHitCritical;
        return mcp;
    }

    private calcEtc(sp: IStats): number {
        const etc: number = sp.etc;
        return etc;
    }
}
