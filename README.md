# koa2-url-cache
Koa 2 middleware for cache response data. 

1. regular match url. [path-to-regexp](https://github.com/pillarjs/path-to-regexp)
2. cache data in redis.

## Install

```
npm install koa2-url-cache --save
```
Get start

```
const config = {
  redis: {
    host: '121.196.203.34',
    port: 6379,
    password: '',
    db: 0,
  },
  urls: {
    '/api/user/:name': {
      ttl: 30, // seconds
    }
  }
}
app.use(cache(config));
```

## refresh
Delete cache manual, qury url add parameter `refresh=1`
### demo
`/api/user/list?refresh=1`

## Config

###  redis
[node_redis](https://github.com/NodeRedis/node_redis)

### prefix [optional]
1. Default 'page'
2. `prefix` is redis prefix key to storage cache data.

### disable [optional]
1. Default false
1. Diasble cache for all routes

###   loggerLevel [optional]
1. Default 'info'
2. Power by [winston](https://github.com/winstonjs/winston)

### http code 200
only cache http code==200 error

### addHeaders {Object} [optional]
Add all key-value to response headers.
```
  addHeaders: {
    "Access-Control-Allow-Origin": "http://localhost:8080",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "*"
  }
```
### urls {Object}
* `key` is match by [path-to-regexp](https://github.com/pillarjs/path-to-regexp)
    * `ttl` {integer}  expire in ttl. seconds。no cache ,set `ttl = null`
    * `addHeaders` {Object}. It will cover the top level `addHeaders`

```
    '/api/user': {
      ttl: '30', // seconds
      addHeaders: { // custom headers
        'x-power':'lx'
      }
    },
```
example:
1. /foo/:bar
1. /:foo/:bar?
1. /:foo(\\d+)
more: [path-to-regexp](https://github.com/pillarjs/path-to-regexp)
...

