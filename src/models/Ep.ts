import { IEpData } from './EpData';

export interface IEp {
    readonly data: IEpData;
    pointsBought: number;

    nextPointCost(): number;
    cumulativePointCost(): number;
}
