import { Difficulty } from '../models/Difficulty';

export function getArmor(round: number, difficulty: Difficulty): number {
    return (difficulty === Difficulty.TowerOfChallenge)
        ? getArmorInternal(round)
        : getArmorTocInternal(round);
}

function getArmorInternal(round: number): number {
    return 0;
}

function getArmorTocInternal(round: number): number {
    return 0;
}
