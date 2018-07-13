const koa = require('koa');
const path = require('path');
const router = require('koa-router')();
const static = require('koa-static');
const data = require('./db/data.json');

const app = new koa();
app.use(static(path.resolve('./public')));

router.get('/books', (ctx) => {
    ctx.body = data;
});

app.use(router.routes());

app.listen(3000);