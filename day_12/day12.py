import itertools
import copy
import functools


IO = [-16, 15, -9]
EUROPA = [-14, 5, 4]
GANYMEDE = [2, 0, 6]
CALLISTO = [-3, 18, 9]
"""
IO = [-8, -10, 0]
EUROPA = [5, 5, 10]
GANYMEDE = [2, -7, 3]
CALLISTO = [9, -8, -3]
"""
MOONS = {
    "IO": IO,
    "EUROPA": EUROPA,
    "GANYMEDE": GANYMEDE,
    "CALLISTO": CALLISTO
}

STEPS = 100

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

def calc_cycles(moons, vel, coord):
    cycle = {}
    i = 0
    while True:
        curr_pos = ""
        for moon in moons.keys():
            curr_pos += str(moons[moon][coord])
        if curr_pos in cycle:
            cycle[curr_pos]+=1
        else:
            cycle[curr_pos] = 0
        if 0 not in cycle.values():
            return (i+1)/2
        vel = update_vel(moons,vel)
        moons = apply_vel(moons,vel)
        i+=1

def day12():
    moons = copy.deepcopy(MOONS)
    vel = initialize_vel(moons)
    for i in range(0,STEPS):
        vel = update_vel(moons,vel)
        moons = apply_vel(moons,vel)
    total_energy = calc_total_energy(moons,vel)
    print(f"Part one answer: {total_energy}")

def gcd(a, b):
    while b:      
        a, b = b, a % b
    return a

def lcm(a, b):
    return a * b // gcd(a, b)

def lcmm(*args): 
    return functools.reduce(lcm, args)

def day12_2():
    moons_x = copy.deepcopy(MOONS)
    x = calc_cycles(moons_x, initialize_vel(moons_x), 0)
    moons_y = copy.deepcopy(MOONS)
    y = calc_cycles(moons_y, initialize_vel(moons_y), 1)
    moons_z = copy.deepcopy(MOONS)
    z = calc_cycles(moons_z, initialize_vel(moons_z), 2)
    print(f"Part two answer: {lcmm(*[x,y,z])*2}")

day12()
day12_2()
