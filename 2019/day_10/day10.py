import math

def parse_input(data):
    locs = []
    for y, line in enumerate(data):
        for x, char in enumerate(line):
            if char == '#':
                locs.append((x,y))
    return locs

def calc_slopes(locs):
    max_unique = ({}, {})
    for ast in locs:
        r_slopes = {}
        l_slopes = {}
        for other_ast in locs:
            if other_ast == ast:
                continue
            distance = math.sqrt( ((ast[0]-other_ast[0])**2)+((ast[1]-other_ast[1])**2) )
            #undefined slope case
            if other_ast[0] == ast[0]:
                slope = -10000
                if other_ast[1] < ast[1]:
                    handle_insert(r_slopes, slope, (distance,other_ast))
                else:
                    handle_insert(l_slopes, slope, (distance,other_ast))
                continue
            slope = (other_ast[1] - ast[1])/(other_ast[0] - ast[0])
            #right two quadrants
            if other_ast[0] > ast[0]:
                handle_insert(r_slopes, slope, (distance,other_ast))
            #left two quadrants
            elif other_ast[0] < ast[0]:
                handle_insert(l_slopes, slope, (distance,other_ast))
        if len(r_slopes) + len(l_slopes) > len(max_unique[0]) + len(max_unique[1]):
            max_unique = (l_slopes,r_slopes)
    for slope_map in max_unique:
        map(lambda k: slope_map[k].sort(key=lambda dist: dist[0]), slope_map.keys())
    return max_unique

def handle_insert(d, key, val):
    if key in d:
        d[key].append(val)
    else:
        d[key] = [val]

def vaporize(locs, num_vaporize):
    i = 0
    while i < num_vaporize:
        for r_slope in sorted(locs[1].keys()):
            if not locs[1][r_slope]:
                continue
            ast = locs[1][r_slope].pop()
            i+=1
            if i==num_vaporize:
                return ast
        for l_slope in sorted(locs[0].keys()):
            if not locs[0][l_slope]:
                continue
            ast = locs[0][l_slope].pop(0)
            #print(f"Vaporized {ast}; Total vaporized: {i}")
            i+=1
            if i==num_vaporize:
                return ast
            
def day10():
    with open("input.txt") as f:
        data = f.readlines()
    data = [x.strip() for x in data]
    locs = parse_input(data)
    max_unique = calc_slopes(locs)
    print(f"Part one answer: {len(max_unique[0]) + len(max_unique[1])}")
    num_vaporize = 200
    last = vaporize(max_unique, num_vaporize)
    print(f"Last one vaporized: {last}; Total vaporized: {num_vaporize}")

if __name__ == "__main__":
    day10()