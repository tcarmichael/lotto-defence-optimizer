import { TORMENT_DATABASE } from '../constants/DifficultyConstants';
import { EnvironmentConstants } from '../constants/EnvironmentConstants';
import { SPECIALTY_DATABASE } from '../constants/SpecialtyDatabase';
import { calcDps } from './Dps';
import { IEnvironment } from './Environment';
import { IProfile } from './Profile';
import { IRune } from './Rune';
import { ISpecialty, Specialty } from './Specialty';
import { IStats, Stats, StatType } from './Stats';

export interface ISpecialtyList {
    readonly allSpecialties: ISpecialty[];

    calcStats(): IStats;
    optimize(profile: IProfile, env: IEnvironment, ep: IStats, gems: IStats): void;
}

export class SpecialtyList implements ISpecialtyList {
    public readonly allSpecialties: ISpecialty[] = SPECIALTY_DATABASE
        .map((data) => new Specialty(data));

    public optimize(profile: IProfile, env: IEnvironment, ep: IStats, gems: IStats): void {
        let sp: number = this.allSpecialties
            .reduce((sum, current) => sum + current.cumulativePointCost(), 0);
        const spBank: ISpecialty = this.allSpecialties.filter((eachSp) => eachSp.data.name === 'SP Bank')[0];
        const spBankRounds: number = spBank.pointsBought * Math.floor((env.targetRound - 1) / 10) * 1000;
        const maxSp: number = profile.calcTotalSp() + spBankRounds;

        console.log('Max SP: %s', maxSp);

        while (sp < maxSp) {
            const spEfficiencies: Array<[ISpecialty, number]> = this.calcSpEfficiencies(env, ep, gems, profile.rune);

            if (sp === 0) {
                spEfficiencies.forEach((o) => console.log('Efficency: %d', o[1]));
            }

            // Return if there isn't any SP (shouldn't happen) or if all efficienies are 0.
            if (spEfficiencies.length === 0 || spEfficiencies.every((o) => o[1] === 0)) {
                break;
            }

            // Loop over the array of [ISpecialty, number] and return the object with the highest efficiency.
            const mostEfficient: [ISpecialty, number] = spEfficiencies
                .filter((each) => each[0].data.requiredTitle <= profile.title)
                .reduce((max, each) => each[1] > max[1] ? each : max);

            // Make sure that the next SP won't put us over the cap.
            if (mostEfficient[0].nextPointCost() <= maxSp - sp) {
                sp += mostEfficient[0].nextPointCost();
                mostEfficient[0].pointsBought++;
            } else {
                break;
            }
        }

        console.log('Remaining SP: %d', maxSp - sp);
    }

    public calcStats(): IStats {
        // Calculate the stats from specialties.
        const stats: IStats = new Stats();

        stats.attackDamage = this.calcStat(StatType.AttackDamage);
        stats.attackSpeed = this.calcStat(StatType.AttackSpeed);
        stats.critChance = this.calcStat(StatType.CritChance);
        stats.critDamage = this.calcStat(StatType.CritDamage);
        stats.multiCrit = this.calcStat(StatType.MultiCrit);
        stats.finalDamageIncrease = this.calcStat(StatType.FinalDamage);
        stats.defenseReduction = this.calcStat(StatType.ArmorReduction);
        stats.unitAcceleration = this.calcStat(StatType.UnitAcceleration);
        stats.multiHitDamage = this.calcStat(StatType.MultiHitDamage);
        stats.multiHitChance = this.calcStat(StatType.MultiHitChance);
        stats.multiHitCritical = this.calcStat(StatType.MultiHitCritical);

        return stats;
    }

    private calcSpEfficiencies(env: IEnvironment, ep: IStats, gems: IStats, rune: IRune): Array<[ISpecialty, number]> {
        // Calculate stats with the current selected specialties.
        const spStats: IStats = this.calcStats();

        // Calculate total stats and current DPS.
        const totalStats: IStats = new Stats(env, spStats, ep, gems, rune);
        const currentDps: number = calcDps(totalStats, env);
        console.log('Current DPS: %s', currentDps.toFixed(6));

        // Calculate the next SP efficiency for each SP.
        return this.allSpecialties.map((sp) => [sp, this.calcEfficiency(sp, currentDps, totalStats, env)]);
    }

    private calcEfficiency(sp: ISpecialty, oldDps: number, oldStats: IStats, env: IEnvironment): number {
        if (sp.pointsBought >= sp.data.maxPoints) {
            return 0;
        }

        // TODO: Implement stat cap
        const isOverStatCap: boolean = false;
        if (isOverStatCap) {
            return 0;
        }

        // Test incrementing the SP by 1 and calculate the new DPS.
        const newStats: IStats = this.calcStatDifferential(oldStats, sp, env);
        const newDps: number = calcDps(newStats, env);

        if (newDps === 0) {
            return 0;
        }

        const dpsGrow: number = newDps / oldDps - 1;
        const nextPointCost: number = sp.nextPointCost();

        const e: number = Math.max(dpsGrow / nextPointCost, 0) * 10e7;
        return e;
    }

    private calcStat(statType: StatType): number {
        let statFormula: (sp: ISpecialty) => number;
        let sumFormula: (sum: number, sp: ISpecialty) => number;
        let seed: number;
        switch (statType) {
            // Unit acceleration is calculated differently.
            case StatType.UnitAcceleration:
                statFormula = (sp: ISpecialty) => Math.pow(1 + sp.data.multiplier / 100, sp.pointsBought);
                sumFormula = (sum: number, sp: ISpecialty) => sum *= statFormula(sp);
                seed = 1;
                break;

            default:
                statFormula = (sp: ISpecialty) => sp.pointsBought * sp.data.multiplier;
                sumFormula = (sum: number, sp: ISpecialty) => sum += statFormula(sp);
                seed = 0;
                break;
        }

        // Add the multi-hit chance base value.
        if (statType === StatType.MultiHitChance) {
            seed = EnvironmentConstants.BASE_MULTI_HIT_CHANCE;
        }

        // Filter all specialties based on the StatType and
        // calculate the stat value from the SP spent.
        const stat: number = this.allSpecialties
            .filter((sp) => sp.data.statType.includes(statType))
            .reduce(sumFormula, seed);

        return stat;
    }

    private calcStatDifferential(baseStats: IStats, sp: ISpecialty, env: IEnvironment): IStats {
        // If the specialty doesn't modify stats, return the base stats.
        if (sp.data.statType.length === 0) {
            return baseStats;
        }

        // Create a copy of stats because we don't want to alter the base stats.
        const returnStats: IStats = Object.create(baseStats);

        // Increment each stat of this specialty by one point.
        sp.data.statType.forEach((statType) => {
            let stat: number = baseStats.getStat(statType);
            let deltaStat: number;
            switch (statType) {
                // Unit acceleration is calculated differently.
                case StatType.UnitAcceleration:
                    deltaStat = 1 + sp.data.multiplier / 100;
                    stat *= deltaStat;
                    break;

                // Handle multiplicative stats.
                case StatType.AttackDamage:
                    deltaStat = sp.data.multiplier;
                    deltaStat *= (1 - TORMENT_DATABASE[env.torments] / 100);
                    deltaStat *= (1 + baseStats.finalDamageIncrease / 100);
                    stat += deltaStat;
                    break;

                case StatType.FinalDamage:
                    returnStats.attackDamage /= (1 + baseStats.finalDamageIncrease / 100);
                    deltaStat = sp.data.multiplier;
                    stat += deltaStat;
                    returnStats.attackDamage *= (1 + stat / 100);
                    break;

                case StatType.CritDamage:
                    deltaStat = sp.data.multiplier;
                    deltaStat *= (1 - TORMENT_DATABASE[env.torments] / 100);
                    stat += deltaStat;
                    break;

                default:
                    deltaStat = sp.data.multiplier;
                    stat += deltaStat;
                    break;
            }

            returnStats.setStat(statType, stat);
        });

        return returnStats;
    }
}
