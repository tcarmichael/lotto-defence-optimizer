import { Difficulty } from './models/Difficulty';
import { Optimizer } from './models/Optimizer';
import { Rank } from './models/Rank';
import { Title } from './models/Title';

const op: Optimizer = new Optimizer();

op.profile.title = Title.Divine;
op.profile.xp = 284579;

op.profile.rune.baseStats.attackDamage = 11;
op.profile.rune.baseStats.attackSpeed = 11;
op.profile.rune.baseStats.critChance = 15;
op.profile.rune.sp = 11;
op.profile.rune.enchantLevel = 8;

op.env.difficulty = Difficulty.Normal;
op.env.dt = true;
op.env.flowerAttackDamage = true;
op.env.flowerAttackSpeed = true;
op.env.flowerDamageTaken = true;
op.env.selfBless = true;
op.env.targetRound = 220;
op.env.unitLevel = 7;
op.env.unitRank = Rank.SSS;

op.optimizeSp();

op.selectedSpecialties.allSpecialties
    .filter((sp) => sp.data.statType.length !== 0)
    .forEach((sp) => { console.log('%s: %i/%i', sp.data.name, sp.pointsBought, sp.data.maxPoints); });
