import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN_UPSTASH,
});

export default redis;
