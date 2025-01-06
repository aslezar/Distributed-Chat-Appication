import time

DISCORD_EPOCH = 1420070400000
BUCKET_SIZE = 1000 * 60 * 60 * 24 * 10 # 10 days
print(f"DISCORD_EPOCH: {DISCORD_EPOCH}")
print(f"BUCKET_SIZE: {BUCKET_SIZE}")


def make_bucket(snowflake):
   if snowflake is None:
        print("Current time", time.time())
        timestamp = int(time.time() * 1000) - DISCORD_EPOCH
   else:
       # When a Snowflake is created it contains the number of
       # seconds since the DISCORD_EPOCH.
       print(f"Snowflake: {snowflake}")
       timestamp = snowflake >> 22
       print(f"Timestamp: {timestamp}")
   return int(timestamp / BUCKET_SIZE)
  
  
def make_buckets(start_id, end_id=None):
   return range(make_bucket(start_id), make_bucket(end_id) + 1)



# Test single bucket
test_snowflake = 13572484591234567
bucket = make_bucket(test_snowflake)
print(f"Single bucket for snowflake {test_snowflake}: {bucket}")

# Test bucket range
start_id = 1234567890123456789
end_id = 1234567890987654321
buckets = make_buckets(start_id, end_id)
print(f"Bucket range from {start_id} to {end_id}: {list(buckets)}")

# Test with None (current time)
current_bucket = make_bucket(None)
print(f"Current time bucket: {current_bucket}")
