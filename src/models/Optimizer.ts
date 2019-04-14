import { Environment, IEnvironment } from './Environment';
import { EpList, IEpList } from './EpList';
import { GemList, IGemList } from './GemList';
import { IProfile, Profile } from './Profile';
import { ISpecialtyList, SpecialtyList } from './SpecialtyList';
import { IStats } from './Stats';

export class Optimizer {
    public profile: IProfile = new Profile();
    public env: IEnvironment = new Environment();
    public selectedSpecialties: ISpecialtyList = new SpecialtyList();
    public selectedEps: IEpList = new EpList();
    public selectedGems: IGemList = new GemList();

    public optimizeSp(): void {
        const epStats: IStats = this.selectedEps.calcStats();
        const gemStats: IStats = this.selectedGems.calcStats(this.profile.xp);
        this.selectedSpecialties.optimize(this.profile, this.env, epStats, gemStats);
    }

    // public optimizeEp(): void {
    //     const spStats: IStats = this.selectedSpecialties.calcStats();
    //     const gemStats: IStats = this.selectedGems.calcStats(this.profile.xp);
    //     this.selectedEps.optimize(this.profile, this.env, spStats, gemStats);
    // }
}
