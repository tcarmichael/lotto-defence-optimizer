import { Difficulty } from '../models/Difficulty';

export interface IDifficultySettings {
    damageDecrease: number;
    speedDecrease: number;
    damageInflicted: number;
    experienceCoefficient: number;
}

class DifficultySettings implements IDifficultySettings {
    constructor(
        public damageDecrease: number,
        public speedDecrease: number,
        public damageInflicted: number,
        public experienceCoefficient: number) {}
}

export const DIFFICULTY_DATABASE: Map<Difficulty, IDifficultySettings> = new Map<Difficulty, IDifficultySettings>([
    [Difficulty.Practice, new DifficultySettings(0, 0, 150, 246.5)],
    [Difficulty.VeryEasy, new DifficultySettings(0, 0, 130, 278.5)],
    [Difficulty.Easy, new DifficultySettings(0, 0, 115, 309.5)],
    [Difficulty.Normal, new DifficultySettings(0, 0, 100, 355.5)],
    [Difficulty.Hard, new DifficultySettings(0, 0, 85, 402)],
    [Difficulty.VeryHard, new DifficultySettings(0, 0, 70, 448.5)],
    [Difficulty.Hell, new DifficultySettings(0, 0, 60, 494.4)],
    [Difficulty.Inferno, new DifficultySettings(0, 0, 50, 541.6)],
    [Difficulty.Lunatic, new DifficultySettings(5, 0, 40, 603)],
    [Difficulty.Holic, new DifficultySettings(10, 0, 35, 664.15)],
    [Difficulty.Epic, new DifficultySettings(15, 5, 30, 726.5)],
    [Difficulty.Ultimate, new DifficultySettings(20, 10, 25, 789)],
    [Difficulty.Impossible, new DifficultySettings(30, 20, 20, 865.5)],
    [Difficulty.TheFinal, new DifficultySettings(50, 30, 15, 942.4)],
    [Difficulty.HallOfFame, new DifficultySettings(100, 50, 10, 1134.4)],
    [Difficulty.TowerOfChallenge, new DifficultySettings(0, 0, 2, 0)],
]);

// The torment database starts at 0 and automatically increments.
export let TORMENT_DATABASE: number[] = [
    0,
    10,
    20,
    30,
    40,
    50,
    60,
    70,
    80,
    90,
    92,
    94,
    95.5,
    97,
];
