import { StatType } from './Stats';

export interface IEpData {
    name: string;
    maxPoints: number;
    multiplier: number;
    startingCost: number;
    costIncrease: number;
    statType: StatType[];
}
