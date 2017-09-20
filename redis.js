const redis = require('redis');
const logger = require('winston');
const Promis = require('bluebird');

Promis.promisifyAll(redis.RedisClient.prototype);
Promis.promisifyAll(redis.Multi.prototype);

module.exports = (config)=>{
  const client = redis.createClient(config);

  client.on("ready", function (err) {
    logger.log("redis is ready ");
  });

  client.on("error", function (err) {
    logger.error("Error " + err);
  });
  return client;
}