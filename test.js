const Koa = require('koa');
const app = new Koa();
const cache = require('./lib');
const config = {
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: '',
    db: 0,
  },
  prefix: 'page:',
  disable: false,
  loggerLevel: 'info',
  addHeaders: {
    "Access-Control-Allow-Origin": "http://localhost:8080",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "*"
  },
  urls: {
    '/api/user': {
      ttl: '30', // seconds
      addHeaders: { // custom headers
        'x-power':'lx'
      }
    },
    '/api/josn': {
      ttl: '30', // seconds
      cors: 'http://localhost:7002'
    }
  }
}
app.use(cache(config));

app.use(ctx => {
  if(ctx.request.url === '/')
    ctx.body = 'Hello user';
  if (ctx.request.url.indexOf('/api/user') !== -1)
    ctx.body = Date.now();
});

app.listen(3000);