import { StatType } from './Stats';
import { Title } from './Title';

export interface ISpecialtyData {
    name: string;
    maxPoints: number;
    multiplier: number;
    startingCost: number;
    costIncrease: number;
    requiredTitle: Title;
    statType: StatType[];
}
