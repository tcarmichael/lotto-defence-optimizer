import { Difficulty } from './Difficulty';
import { Rank } from './Rank';
import { Title } from './Title';

export interface IEnvironment {
    difficulty: Difficulty;
    dt: boolean;
    flowerAttackDamage: boolean;
    flowerAttackSpeed: boolean;
    flowerDamageTaken: boolean;
    selfBless: boolean;
    haveArtifact: boolean;
    haveSpecOps: boolean;
    haveTerraTron: boolean;
    haveAmon: boolean;
    haveSpearOfAdun: boolean;
    haveXelnagaKerrigan: boolean;
    singleUnitBuff: boolean;
    duplicateUnitPenalty: number;
    limitBreak: number;
    targetRound: number;
    teamAttackDamage: number;
    teamAttackSpeed: number;
    teamCritChance: number;
    teamBless: number;
    torments: number;
    unitLevel: number;
    unitRank: Rank;
    useAverageUpgrade: boolean;

    calcAverageUpgrade(): number;
}

export class Environment implements IEnvironment {
    private static calcBaseUp(zero: boolean, upRev: number): number {
        let upP: number = 100;

        if (zero) {
            upP += 20;
        }

        // Gem sharing
        upP += 5;

        upP += upRev * 2;

        return upP;
    }

    private static fnUpC(tries: number, zero: boolean, upRev: number, upFRev: number): number {
        const upP: number = Environment.calcBaseUp(zero, upRev);

        // Fail increase
        const fI: number = 4 + 2 * upFRev;

        // Calculate the streak chances.
        const streakChance: number[] = [];
        for (let i = 0; i < tries; i++) {
            const x: number = 1 - 70 / (upP + i * fI);
            streakChance.push(x);
        }

        // Calculate the upgrade odds.
        const upOdds: number[] = [];
        for (let i = 0; i < tries; i++) {
            let x: number;
            if (i === 0) {
                x = 1;
            } else if (i === 1) {
                x = streakChance[i];
            } else {
                for (let j = 0; j < i - 1; j++) {
                    let inter: number = 1;
                    for (let f = 0; f < j - 1; f++) {
                        inter *= (1 - streakChance[f]);
                    }
                    x += (inter * streakChance[j] * upOdds[i - 1 - j]);
                }
            }
            upOdds.push(x);
        }

        // Calculate the average.
        let sum: number = 0;
        for (let i = 0; i < tries; i++) {
            sum += upOdds[i];
        }

        const result: number = sum / tries;
        return result;
    }

    public difficulty: Difficulty = Difficulty.Practice;
    public dt: boolean = true;
    public flowerAttackDamage: boolean = false;
    public flowerAttackSpeed: boolean = false;
    public flowerDamageTaken: boolean = false;
    public selfBless: boolean = false;
    public haveArtifact: boolean = false;
    public haveSpecOps: boolean = false;
    public haveTerraTron: boolean = false;
    public haveAmon: boolean = false;
    public haveSpearOfAdun: boolean = false;
    public haveXelnagaKerrigan: boolean = false;
    public singleUnitBuff: boolean = false;
    public duplicateUnitPenalty: number = 0;
    public limitBreak: number = 0;
    public targetRound: number = 90;
    public teamAttackDamage: number = 0;
    public teamAttackSpeed: number = 0;
    public teamCritChance: number = 0;
    public teamBless: number = 0;
    public torments: number = 0;
    public unitLevel: number = 0;
    public unitRank: Rank = Rank.C;
    public useAverageUpgrade: boolean = false;

    public calcAverageUpgrade(): number {
        const calculatedUpgradeChances: number = 0;
        const myUpgradeChances: number = 0;
        const myTitle: Title = Title.Divine;
        const upgradeRevisions: number = 0;
        const upgradeFailRevisions: number = 0;
        const doubleUpgradeLottos: number = 0;
        const hasUpgradeMastery: boolean = true;

        const successProbability: number = Environment.fnUpC(
            calculatedUpgradeChances,
            myTitle >= Title.TheZero,
            upgradeRevisions,
            upgradeFailRevisions);

        const averageUpgrade: number = 30
            * successProbability
            * Math.max(calculatedUpgradeChances, myUpgradeChances)
            * ((100 + doubleUpgradeLottos) / 100)
            + (hasUpgradeMastery ? calculatedUpgradeChances * (1 - successProbability) * 10 / 2 : 0);
        return averageUpgrade;
    }
}
