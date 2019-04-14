import { getArmor } from '../constants/ArmorConstants';
import { DIFFICULTY_DATABASE } from '../constants/DifficultyConstants';
import { IDifficultySettings } from '../constants/DifficultyConstants';
import { EnvironmentConstants } from '../constants/EnvironmentConstants';
import { RankConstants } from '../constants/RankConstants';
import { IEnvironment } from './Environment';
import { Rank } from './Rank';
import { IStats } from './Stats';

export function calcDps(stats: IStats, env: IEnvironment): number {
    // Account for AD, damage inflicted, enemy armor, armor reudction, FD, flower 3.
    const diffSettings: IDifficultySettings = DIFFICULTY_DATABASE.get(env.difficulty);
    const enemyArmor: number = getArmor(env.targetRound, env.difficulty);
    const flowerDamageTaken: number = (env.flowerDamageTaken) ? EnvironmentConstants.FLOWER_DAMAGE_TAKEN : 1;

    const ae: number = (stats.attackDamage / 100)
        * (diffSettings.damageInflicted / 100)
        * (100 / (100 + enemyArmor * (1 - stats.defenseReduction / 100)))
        * flowerDamageTaken;

    // Account for normal crit and multi-crit.
    const c: number = calcAverageCritDamage(stats.critChance, stats.critDamage, stats.multiCrit);

    // Account for multi-hit damage, multi-hit crit, and multi-hit multi-crit.
    const multiHitCritDamage: number = calcAverageCritDamage(stats.multiHitCritical, stats.critDamage, stats.multiCrit);
    const m: number = (Math.min(1, stats.multiHitChance / 100)) * (stats.multiHitDamage / 100) * multiHitCritDamage;

    // Account for AS, speed decrease, UA, DT, SXD, RXD.
    // Place stimpack gem here if it is later added.
    const dtModifier: number = (env.dt) ? EnvironmentConstants.DT_SPEED : 1;
    const rankModifier: number =
        (env.unitRank === Rank.RXD) ? RankConstants.RXD_SPEED :
        (env.unitRank === Rank.SXD) ? RankConstants.SXD_SPEED :
        1;
    const flowerModifier: number = (env.flowerAttackSpeed) ? EnvironmentConstants.FLOWER_ATTACK_SPEED : 1;
    const s: number = (1 + stats.attackSpeed / 100)
        * (1 - diffSettings.speedDecrease / 100)
        * stats.unitAcceleration
        * dtModifier
        * rankModifier
        * flowerModifier;

    return ae * (c + m) * s;
}

function calcAverageCritDamage(cc: number, cd: number, mc: number): number {
    const critChance: number = Math.min(1, (cc / 100));
    const critDamage: number = (cd / 100);
    const multiCritChance: number = critChance *
        Math.min(1, (cc * EnvironmentConstants.MULTI_CRIT_CHANCE / 100));
    const multiCritDamage: number = mc * critDamage * EnvironmentConstants.MULTI_CRIT_DAMAGE;

    return 1 + critChance * critDamage + multiCritChance * multiCritDamage;
}
