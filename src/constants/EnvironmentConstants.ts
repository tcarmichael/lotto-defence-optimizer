import { StatType } from '../models/Stats';

export class EnvironmentConstants {
    public static readonly ARTIFACT_CRIT_CHANCE: number = 20;
    public static readonly FLOWER_ATTACK_DAMAGE: number = 1.2;
    public static readonly FLOWER_ATTACK_SPEED: number = 1.15 * 1.25;
    public static readonly FLOWER_DAMAGE_TAKEN: number = 1.1;

    public static readonly BLESS_DAMAGE: number = 20;

    public static readonly SPEC_OPS_NOVA_ATTACK_SPEED: number = 15;
    public static readonly TERRA_TRON_CRIT_CHANCE: number = 10;
    public static readonly AMON_ATTACK_DAMAGE: number = 30;
    public static readonly SPEAR_OF_ADUN_CRIT_DAMAGE: number = 30;
    public static readonly XELNAGA_KERRIGAN_CRIT_CHANCE: number = 10;

    public static readonly DT_SPEED: number = 1.15;

    public static readonly UNIT_LEVEL_ATTACK_DAMAGE_MODIFIER: number = 5;
    public static readonly SINGLE_UNIT_ATTACK_DAMAGE: number = 30;
    public static readonly DUPLICATE_UNIT_ATTACK_DAMAGE_PENALTY: number = 10;

    public static readonly STARTER_GEM_STATS: number = 5;
    public static readonly STARTER_GEM_MULTIPLIER: number = 2;
    public static readonly STARTER_GEM_EXPERIENCE: number = 20000;

    public static readonly POWER_BANKER_GEM_STATS: number = 50;

    // Source: http://www.arcade.sc/threads/12002-QUESTION-Multi-Critical?p=38213#post38213
    public static readonly MULTI_CRIT_CHANCE: number = 1 / 3;
    public static readonly MULTI_CRIT_DAMAGE: number = 3 / 4;

    public static readonly BASE_MULTI_HIT_CHANCE: number = 20;

    public static readonly STAT_CAPS: Record<StatType, number>;

    public static readonly GENERAL_BONUS_SP: number = 2000;
    public static readonly STARTING_SP: number = 5000;
}
