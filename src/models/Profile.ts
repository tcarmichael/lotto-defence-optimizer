import { EnvironmentConstants } from '../constants/EnvironmentConstants';
import { IRune, Rune } from './Rune';
import { Title } from './Title';

export interface IProfile {
    rune: IRune;
    title: Title;
    xp: number;

    calcTotalSp(): number;
}

export class Profile implements IProfile {
    public rune: IRune = new Rune();
    public title: Title = Title.Rookie;
    public xp: number = 0;

    public calcTotalSp(): number {
        const baseSp: number = this.xp
            + EnvironmentConstants.GENERAL_BONUS_SP
            + EnvironmentConstants.STARTING_SP;

        const runeBonus: number = (this.rune.sp / 100) * baseSp;

        return baseSp + runeBonus;
    }
}
