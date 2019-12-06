from functools import reduce

depth_map = {}

def build_directed_graph(data):
    graph = {}
    for line in data:
        rel = line.split(')')
        if rel[0] in graph:
            graph[rel[0]].append(rel[1])
        else:
            graph[rel[0]] = [rel[1]]
    return graph

def build_nondirected_graph(data):
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
    explored = []
    
    queue = [(start,0)]
    while queue:
        orbit = queue.pop()
        if end in adj[orbit[0]]:
            return orbit[1]
        if orbit[0] not in explored:
            explored.append(orbit[0])
            unexplored_planets = list(filter(lambda p : p not in explored, adj[orbit[0]]))
            for planet in unexplored_planets:
                queue.append((planet,orbit[1]+1))

def day6():
    with open("input.txt") as f:
        data = f.readlines()
    data = [x.strip() for x in data]

    directed_graph = build_directed_graph(data)
    assign_depth(directed_graph,'COM',0)
    part_1_answer = sum_depth(directed_graph,'COM')
    print(f"Part one answer is: {part_1_answer}")

    undirected_graph = build_nondirected_graph(data)
    part_2_answer = bfs(undirected_graph['YOU'][0],'SAN',undirected_graph)
    print(f"Part two answer is: {part_2_answer}")

if __name__ == "__main__":
    day6()