import sys

WIDTH = 25
HEIGHT = 6

def build_layers(data, layer_height, layer_width):
    layers = []
    i = 0
    while i < len(data):
        layer = []
        layers.append(data[i:i+(layer_width*layer_height)])
        i+=layer_width*layer_height
    return layers

def find_min_zero_layer(layers):
    min = sys.maxsize
    for i,layer in enumerate(l for l in layers):
        if layer.count('0') < min:
            min = layer.count('0')
            index = i
    return layers[index].count('1') * layers[index].count('2')

def decode(layers, layer_height, layer_width):
    result = []
    for i in range(0, layer_height*layer_width):
        layer_depth = 0
        while layers[layer_depth][i] == '2':
            layer_depth +=1
        result.append(layers[layer_depth][i])
    return "".join(result)
        
def render(data):
    i = 0
    data = data.replace('0', ' ')
    print("Part two answer: \n")
    for j in range(0, HEIGHT):
        print(data[i:i+WIDTH])
        i+=WIDTH

def day8():
    with open("input.txt") as f:
        data = f.readlines()[0].strip()

    layers = build_layers(data, HEIGHT, WIDTH)
    print(f"Part one answer is : {find_min_zero_layer(layers)}")

    result = decode(layers, HEIGHT, WIDTH)
    render(result)
    

if __name__ == "__main__":
    day8()