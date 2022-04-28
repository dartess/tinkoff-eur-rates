import Koa from 'koa';
import Router from '@koa/router';
import got from 'got';

const app = new Koa();
const router = new Router();

const prices = [];
const MAX_ITEMS = 24 * 60;
const INTERVAL = 20 * 1000;

const updateRate = async () => {
    const date = Date.now();
    let price = -1;
    try {
        const { payload: { rates } } = await got.get('https://api.tinkoff.ru/v1/currency_rates?from=EUR&to=RUB').json();
        price = rates.find(rate => rate.category === 'OPSRateGroup').buy;
    } catch {}
    prices.unshift({ date, price });
    prices.length = Math.min(MAX_ITEMS, prices.length);
};

updateRate();
setInterval(updateRate, INTERVAL);

router.get('/all', (ctx, next) => {
    ctx.body = prices;
    return next();
});

router.get('/last', (ctx, next) => {
    ctx.body = prices[0];
    return next();
});

router.get('/last-only-price', (ctx, next) => {
    ctx.body = prices[0].price;
    return next();
});

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000);