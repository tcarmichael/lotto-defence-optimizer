import { Rank } from '../models/Rank';

export class RankConstants {
    public static readonly RXD_SPEED: number = 1.5;
    public static readonly SXD_SPEED: number = 1.25;

    public static readonly DAMAGE_LOOKUP: Map<Rank, number> = new Map<Rank, number>([
        [Rank.D, -10],
        [Rank.C, -5],
        [Rank.B, 0],
        [Rank.A, 5],
        [Rank.S, 10],
        [Rank.SS, 20],
        [Rank.SSS, 30],
        [Rank.X, 40],
        [Rank.XD, 50],
        [Rank.SXD, 50],
        [Rank.RXD, 100],
    ]);

    public static readonly LIMIT_BREAK_DAMAGE_LOOKUP: number[] = [
        0,
        50,
        100,
        175,
        300,
        500,
    ];

    public static readonly LIMIT_BREAK_ACCELERATION_LOOKUP: number[] = [
        0,
        0,
        0,
        10,
        20,
        30,
    ];
}
