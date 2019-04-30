import { Difficulty } from '../models/Difficulty';

export function getArmor(round: number, difficulty: Difficulty): number {
    return (difficulty === Difficulty.TowerOfChallenge)
        ? getArmorInternal(round)
        : getArmorTocInternal(round);
}

function getArmorInternal(round: number): number {
    if (round < 160) {
        return 0;
    } else if (round < 180) {
        return (round - 160 + 1) * 4;
    } else if (round < 200) {
        return (180 - 160) * 4 + (round - 180 + 1) * 8;
    } else if (round < 220) {
        return (180 - 160) * 4 + (200 - 180) * 8 + (round - 200 + 1) * 12;
    }
}

function getArmorTocInternal(round: number): number {
    return 0;
}
