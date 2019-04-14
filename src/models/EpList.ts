import { IEp } from './Ep';
import { IStats, Stats } from './Stats';

export interface IEpList {
    readonly allEps: IEp[];

    calcStats(): IStats;
}

export class EpList implements IEpList {
    public readonly allEps: IEp[];

    public calcStats(): IStats {
        return new Stats();
    }

    // private calcEtc(): number {
    //     return E91 / 2;
    // }
}
