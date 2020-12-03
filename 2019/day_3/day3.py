import sys
import time

direction_vector_map = {
    'U' : (0, 1),
    'D' : (0, -1),
    'L' : (-1, 0),
    'R' : (1, 0)
}

def insert_points(point_map, move_type, move_val, start_posx, start_posy, step):

    dir_vector = direction_vector_map[move_type]

    for i in range(1, move_val+1):
        new_point = (start_posx + i*dir_vector[0], start_posy + i*dir_vector[1])
        point_map[new_point] = step + i

    return (start_posx + move_val*dir_vector[0], start_posy + move_val*dir_vector[1])

def build_map(move_list):

    new_pos = (0,0)
    step = 0
    point_map = {}

    for move in move_list:
        move_type = move[0]
        move_val = int(move[1:])
        new_pos = insert_points(point_map, move_type, move_val, new_pos[0], new_pos[1], step)
        step += move_val
    return point_map

def find_min_dist(intercept_set):
    return min(abs(posx) + abs(posy) for (posx,posy) in intercept_set)

def eval_lowest_step_intercept(intercept_set, map_1, map_2):
    return min(map_1[pos] + map_2[pos] for pos in intercept_set)

def day3():
    
    f = open("input.txt", "r")
    circuit_one = f.readline().split(',')
    circuit_two = f.readline().split(',')

    start = time.time()
    point_map_1 = build_map(circuit_one)
    point_map_2 = build_map(circuit_two)
    intercept_set = point_map_1.keys()&point_map_2.keys()
    print(find_min_dist(intercept_set))
    end = time.time()
    print(f"Elapsed time: {end-start}")

    start = time.time()
    print(eval_lowest_step_intercept(intercept_set, point_map_1, point_map_2))
    end = time.time()
    print(f"Elapsed time: {end-start}")

if __name__ == "__main__":
    day3()