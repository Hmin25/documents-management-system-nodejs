import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './routes';

const app = new Koa();

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    return;
  }
  await next();
});

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

export default app;