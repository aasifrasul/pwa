def most_frequent_item(dataset):
    freq_dict = {}
    for item in dataset:
        if item in freq_dict:
            freq_dict[item] += 1
        else:
            freq_dict[item] = 1
    max_freq = 0
    max_item = None
    for item, freq in freq_dict.items():
        if freq > max_freq:
            max_freq = freq
            max_item = item
    return max_item


dataset = [1, 2, 3, 2, 1, 2, 3, 3, 3, 1, 2, 2, 3, 3]
most_frequent = most_frequent_item(dataset)
print(most_frequent) # Output: 2
