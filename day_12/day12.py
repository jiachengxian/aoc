import itertools
import copy

IO = [-16, 15, -9]
EUROPA = [-14, 5, 4]
GANYMEDE = [2, 0, 6]
CALLISTO = [-3, 18, 9]
"""
IO = [-1, 0, 2]
EUROPA = [2, -10, -7]
GANYMEDE = [4, -8, 8]
CALLISTO = [3, 5, -1]
"""
MOONS = {
    "IO": IO,
    "EUROPA": EUROPA,
    "GANYMEDE": GANYMEDE,
    "CALLISTO": CALLISTO
}

STEPS = 1000

def update_vel(moons, vel):
    for (moon,other) in itertools.combinations(moons.keys(),2):
        for i in range(0,len(moons[moon])):
            if moons[moon][i] > moons[other][i]:
                vel[moon][i] -= 1
                vel[other][i] += 1
            elif moons[moon][i] < moons[other][i]:
                vel[moon][i] += 1
                vel[other][i] -= 1
    return vel

def apply_vel(moons, vel):
    for moon in moons.keys():
        for i in range(0, len(moons[moon])):
            moons[moon][i] += vel[moon][i]
    return moons

def initialize_vel(moons):
    vel = {}
    for moon in moons.keys():
        vel[moon] = [0,0,0]
    return vel

def calc_total_energy(moons, vel):
    total = 0
    for moon in moons.keys():
        pot = sum(abs(p) for p in moons[moon])
        kin = sum(abs(v) for v in vel[moon])
        total += pot*kin
    return total

def day12():
    moons = MOONS
    vel = initialize_vel(moons)
    for i in range(0,STEPS):
        vel = update_vel(moons,vel)
        moons = apply_vel(moons,vel)
    total_energy = calc_total_energy(moons,vel)
    print(f"Part one answer: {total_energy}")


day12()
