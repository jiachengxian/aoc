def apply_phase(input):
    result = ""
    for i in range(0, len(input)):
        pattern = "0" * (i + 1) + "1" * (i + 1) + "0" * (i + 1) + "N" * (i + 1)
        pattern = pattern[: len(input) + 1]
        curr_line = 0
        for j in range(0, len(input)):
            factor = (
                -1
                if pattern[(j + 1) % len(pattern)] == "N"
                else int(pattern[(j + 1) % len(pattern)])
            )
            curr_line += factor * int(input[j])
        result += str(curr_line)[-1]
    return result


def apply_num_phases(input, num_phases):
    for _i in range(0, num_phases):
        input = apply_phase(input)
    return input


def apply_phase_with_offset(input):
    result = ""
    sum = 0
    for i in reversed(range(0, len(input))):
        sum += int(input[i])
        result = str(sum)[-1] + result
    return result


def apply_num_phases_with_offset(input, num_phases):
    offset = int(input[0:7])
    input = input[offset:]
    for _i in range(0, num_phases):
        input = apply_phase_with_offset(input)
    return input


def day_16():
    with open("input.txt") as f:
        input = f.readlines()[0].strip()
    # part_1 = apply_num_phases(input, 100)
    # print(part_1[0:8])
    part_2 = apply_num_phases_with_offset(input * 10000, 100)
    print(part_2[0:8])


day_16()
