from functools import reduce

depth_map = {}

def day6():
    with open("input.txt") as f:
        data = f.readlines()
    data = [x.strip() for x in data]

    directional_adj = build_directional_graph(data)
    assign_depth(directional_adj,'COM',0)
    part_1_answer = sum_depth(directional_adj,'COM')
    print(f"Part one answer is: {part_1_answer}")

    bidirectional_graph = build_bidirectional_graph(data)
    part_2_answer = bfs('YOU','SAN',bidirectional_graph)
    print(part_2_answer)

def build_directional_graph(data):
    graph = {}
    for line in data:
        rel = line.split(')')
        if rel[0] in graph:
            graph[rel[0]].append(rel[1])
        else:
            graph[rel[0]] = [rel[1]]
    return graph

def build_bidirectional_graph(data):
    graph = {}
    for line in data:
        rel = line.split(')')
        if rel[0] in graph:
            graph[rel[0]].append(rel[1])
        else:
            graph[rel[0]] = [rel[1]]
        if rel[1] in graph:
            graph[rel[1]].append(rel[0])
        else:
            graph[rel[1]] = [rel[0]]
    return graph

def assign_depth(adj, curr, depth):
    depth_map[curr] = depth
    if curr not in adj:
        return
    for planet in adj[curr]: 
        assign_depth(adj, planet, depth+1)
    return

def sum_depth(adj, start):
    sum = 0
    adj_list = adj[start]
    while adj_list:
        planet = adj_list.pop()
        sum+=depth_map[planet]
        if planet in adj:
            adj_list.extend(adj[planet])
    return sum

def bfs(start, end, adj):
    #actual start and end due to problem's wording
    #we want to start on the planet directly orbiting our actual start and end
    actual_end = adj[end][0]
    explored = []
    
    queue = [(start,0)]
    while queue:
        orbit = queue.pop()
        if actual_end in adj[orbit[0]]:
            return orbit[1]
        if orbit[0] not in explored:
            explored.append(orbit[0])
            for planet_adj in adj[orbit[0]]:
                if planet_adj not in explored:
                    queue.append((planet_adj,orbit[1]+1))
day6()