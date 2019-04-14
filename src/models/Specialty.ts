import { ISpecialtyData } from './SpecialtyData';
import { StatType } from './Stats';
import { Title } from './Title';

export interface ISpecialty {
    readonly data: ISpecialtyData;
    pointsBought: number;

    nextPointCost(): number;
    cumulativePointCost(): number;
}

export class Specialty implements ISpecialty {
    public pointsBought: number = 0;

    constructor(public readonly data: ISpecialtyData) {}

    public nextPointCost(): number {
        // This doesn't account for >150 points bought for The One specialties in Korea.
        if (this.pointsBought === this.data.maxPoints) {
            return Infinity;
        } else if (this.pointsBought > this.data.maxPoints) {
            throw new Error('Points bought > Max points');
        } else if (this.isMultiCrit()) {
            // Handle custom multi-crit formula.
            return this.nextPointCostMultiCrit();
        } else {
            return this.data.startingCost + this.pointsBought * this.data.costIncrease;
        }
    }

    public cumulativePointCost(): number {
        // This doesn't account for >150 points bought for The One specialties in Korea.
        if (this.pointsBought > this.data.maxPoints) {
            throw new Error('Points bought > Max points');
        } else if (this.isMultiCrit()) {
            return this.cumulativePointCostMultiCrit();
        } else {
            const a: number = this.data.startingCost;
            const d: number = this.data.costIncrease;
            const n: number = this.pointsBought;
            return (n * (2 * a + (n - 1) * d)) / 2;
        }
    }

    private isMultiCrit(): boolean {
        return this.data.statType.length > 0 && this.data.statType.every((t) => t === StatType.MultiCrit);
    }

    private nextPointCostMultiCrit(): number {
        if (this.data.requiredTitle === Title.Expert) {
            if (this.pointsBought < 8) {
                return 350 * Math.pow(2, this.pointsBought);
            } else if (this.pointsBought < 20) {
                return 50000;
            } else {
                return 100000;
            }
        } else if (this.data.requiredTitle === Title.TheOne2) {
            if (this.pointsBought < 5) {
                return 75000;
            } else if (this.pointsBought < 10) {
                return 225000;
            } else {
                return 675000;
            }
        }
    }

    private cumulativePointCostMultiCrit(): number {
        if (this.data.requiredTitle === Title.Expert) {
            if (this.pointsBought <= 8) {
                return 350 * (Math.pow(2, this.pointsBought) - 1);
            } else if (this.pointsBought <= 20) {
                return 350 * (Math.pow(2, 7) - 1)
                    + 50000 * (this.pointsBought - 7);
            } else {
                return 350 * (Math.pow(2, 7) - 1)
                    + 50000 * (20 - 7)
                    + 100000 * (this.pointsBought - 20);
            }
        } else if (this.data.requiredTitle === Title.TheOne2) {
            if (this.pointsBought <= 5) {
                return 75000 * this.pointsBought;
            } else if (this.pointsBought <= 10) {
                return 75000 * 5
                    + 225000 * (this.pointsBought - 5);
            } else {
                return 75000 * 5
                + 225000 * (10 - 5)
                + 675000 * (this.pointsBought - 10);
            }
        }
    }
}
