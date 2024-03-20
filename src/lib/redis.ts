import { createClient } from "redis";

// Create a new redis client
export const redis = createClient({
  url: 'redis://:docker@localhost:6379'
})

// Connect to the redis server
redis.connect();