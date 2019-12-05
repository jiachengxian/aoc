RANGE_RULE = (236491,713787)
count = 0
for number in range(RANGE_RULE[0],RANGE_RULE[1]+1):
    num_string = str(number)
    in_order = True
    for i in range(1,len(num_string)):
        in_order = in_order and num_string[i] >= num_string[i-1]
    if not in_order: 
        continue

    freq = {}
    for i in range(0,len(num_string)):
        if num_string[i] in freq:
            freq[num_string[i]] +=1
        else:
            freq[num_string[i]] = 1
    if 2 not in freq.values():
        continue
    count+=1
print(count)
