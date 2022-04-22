import Koa from 'koa';
import Router from '@koa/router';
import got from 'got';

const app = new Koa();
const router = new Router();

const prices = [];
const MAX_ITEMS = 24 * 60;
const INTERVAL = 20 * 1000;

setInterval(
    async () => {
        const date = Date.now();
        let price = -1;
        try {
            const { payload: { rates } } = await got.get('https://api.tinkoff.ru/v1/currency_rates?from=EUR&to=RUB').json();
            price = rates.find(rate => rate.category === 'OPSRateGroup').buy;
        } catch {}
        prices.push({ date, price });
        prices.length = Math.min(MAX_ITEMS, prices.length);
    },
    INTERVAL
)

router.get('/all', (ctx, next) => {
    ctx.body = prices;
    return next();
});

router.get('/last', (ctx, next) => {
    ctx.body = prices[prices.length - 1];
    return next();
});

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000);