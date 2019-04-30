import { Difficulty } from './models/Difficulty';
import { Optimizer } from './models/Optimizer';
import { Rank } from './models/Rank';
import { Title } from './models/Title';

const op: Optimizer = new Optimizer();

op.profile.title = Title.TheOne1;
op.profile.xp = 438022 - 4811;

op.profile.rune.baseStats.attackDamage = 11;
op.profile.rune.baseStats.attackSpeed = 11;
op.profile.rune.baseStats.critChance = 15;
op.profile.rune.sp = 11;
op.profile.rune.enchantLevel = 8;

// op.selectedEps.allEps.forEach((e) => {
//     if (e.data.statType.includes(StatType.AttackDamage)) {
//         e.pointsBought = 2;
//     }
//     if (e.data.statType.includes(StatType.AttackSpeed)) {
//         e.pointsBought = 2;
//     }
//     if (e.data.statType.includes(StatType.CritChance)) {
//         e.pointsBought = 1;
//     }
//     if (e.data.statType.includes(StatType.CritDamage)) {
//         e.pointsBought = 2;
//     }
// })

// op.selectedSpecialties.allSpecialties
//     .filter((sp) => sp.data.name === 'SP Bank')[0]
//     .pointsBought = 41;

op.selectedSpecialties.allSpecialties
    .filter((sp) => sp.data.name === 'Bonus Minerals')[0]
    .pointsBought = 4;

// op.selectedSpecialties.allSpecialties
//     .filter((sp) => sp.data.name === 'Bank Lotto')[0]
//     .pointsBought = 40;

// op.selectedSpecialties.allSpecialties
//     .filter((sp) => sp.data.name === 'Mineral Kill Lotto')[0]
//     .pointsBought = 60;

// op.selectedSpecialties.allSpecialties
//     .filter((sp) => sp.data.name === 'Gas Kill Lotto')[0]
//     .pointsBought = 20;

op.selectedSpecialties.allSpecialties
    .filter((sp) => sp.data.name === 'Basic Rank')[0]
    .pointsBought = 4;

// op.selectedSpecialties.allSpecialties
//     .filter((sp) => sp.data.name === 'Gold Card Revision')[0]
//     .pointsBought = 5;

// op.selectedSpecialties.allSpecialties
//     .filter((sp) => sp.data.name === 'Unit Lottery')[0]
//     .pointsBought = 72;

// op.selectedSpecialties.allSpecialties
//     .filter((sp) => sp.data.name === 'Lottery Revision')[0]
//     .pointsBought = 15;

// op.selectedSpecialties.allSpecialties
//     .filter((sp) => sp.data.name === 'Maximum Hero Upgrades')[0]
//     .pointsBought = 10;

// op.selectedSpecialties.allSpecialties
//     .filter((sp) => sp.data.name === 'Upgrade Revision')[0]
//     .pointsBought = 5;

// op.selectedSpecialties.allSpecialties
//     .filter((sp) => sp.data.name === 'Upgrade Fail Revision')[0]
//     .pointsBought = 3;

// op.selectedSpecialties.allSpecialties
//     .filter((sp) => sp.data.name === 'Rank Revision 1')[0]
//     .pointsBought = 5;

// op.selectedSpecialties.allSpecialties
//     .filter((sp) => sp.data.name === 'Rank Revision 2')[0]
//     .pointsBought = 3;

// op.selectedSpecialties.allSpecialties
//     .filter((sp) => sp.data.name === 'SXD Revision')[0]
//     .pointsBought = 10;

op.env.difficulty = Difficulty.TheFinal;
op.env.dt = true;
// op.env.haveArtifact = true;
op.env.flowerAttackDamage = true;
op.env.flowerAttackSpeed = true;
// op.env.flowerDamageTaken = true;
op.env.selfBless = true;
op.env.targetRound = 115;
// op.env.haveXelnagaKerrigan = true;
// op.env.haveSpearOfAdun = true;
// op.env.haveSpecOps = true;
op.env.unitLevel = 6;
op.env.unitRank = Rank.X;
op.env.teamAttackDamage = 54;
op.env.teamAttackSpeed = 54;
op.env.teamCritChance = 27;
op.env.teamBless = 40;
op.env.helpful = true;

op.optimizeSp();

op.selectedSpecialties.allSpecialties
    .filter((sp) => sp.data.statType.length !== 0 && sp.pointsBought > 0)
    .forEach((sp) => { console.log('%s: %i/%i', sp.data.name, sp.pointsBought, sp.data.maxPoints); });
