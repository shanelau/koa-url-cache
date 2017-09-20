const pathToRegexp = require('path-to-regexp');
var logger = require('winston');
const regexs = [];


function needCache(key) {
  for (let i = 0; i < regexs.length; i++) {
    const pattern = regexs[i];
    if (pattern.regex.test(key)) return pattern;
  }
  return false;
}

/*
 * 接口 cache, 根据 url 前缀设置 cache
 * 开发环境不会启用缓存
 * ?refresh=1  重新建立缓存
 */
module.exports = options => {
  logger.level = 'info' || options.loggerLevel;
  const disable = options.disable || false;
  const cachePrefix = options.prefix || 'page:';
  const redis = require('./redis.js')(options.redis);

  Object.keys(options.urls).forEach((url)=>{
    const item = options.urls[url];
    item.regex = pathToRegexp(url);
    item.addHeaders = item.addHeaders || [];
    regexs.push(item);
  })

  return async function cache(ctx, next) {
    // skip
    if (disable) {
      await next();
      return;
    }
    let key = ctx.request.originalUrl;
    const url = key.indexOf('?') > 0 ? ctx.request.url.split('?')[0] : key;
    const patten = needCache(url);
    if (!patten.ttl) {
      return await next();
    }
      // 需要缓存
      const data = await redis.getAsync(cachePrefix + key);
      if (data && !ctx.request.query.refresh) {  // redis 存在数据，并且不是主动缓存
        logger.info(key, ' cached');
        ctx.set('Cache-Control', `max-age=${patten.ttl}`);
        // set common headers
        Object.keys(options.addHeaders).forEach(header =>{
          ctx.set(header, options.addHeaders[header]);
        });
        // set url headers
        Object.keys(patten.addHeaders).forEach(header => {
          ctx.set(header, patten.addHeaders[header]);
        });
        ctx.response.body = JSON.parse(data);
        return;
      }
      await next();
      if (ctx.status === 200) {
        if (ctx.request.query.refresh) {
          key = key.replace('?refresh=1', ''); // /api/helo?refresh=1
          key = key.replace('&refresh=1', ''); // /api/helo?a=b&refresh=1
        }
        const result = JSON.stringify(ctx.response.body);
        await redis.setAsync(cachePrefix + key, result, 'EX', patten.ttl);
      }
  };
};