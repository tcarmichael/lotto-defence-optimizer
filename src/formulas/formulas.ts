
function NextPointCost(
    startingCost: number,
    costIncrease: number,
    pointsBought: number,
    max: number): number {
        if (pointsBought >= max) {
            return -1;
        } else {
            return startingCost + pointsBought * costIncrease;
        }
    }

function CumulativePointCost(
    startingCost: number,
    costIncrease: number,
    pointsBought: number,
    max: number): number {
        if (pointsBought > max) {
            return -1;
        } else {
            return (pointsBought * (2 * startingCost + (pointsBought - 1) * costIncrease)) / 2;
        }
    }

