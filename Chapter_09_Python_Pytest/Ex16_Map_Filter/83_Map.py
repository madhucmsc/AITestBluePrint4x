respinse_times_milsec=[1200,9000,3450,5432]
def convert_to_seconds(x):
    return x/1000

response_times_seconds=list(map(convert_to_seconds,respinse_times_milsec))
print(response_times_seconds)