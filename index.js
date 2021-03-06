import Koa from 'koa';
import Router from '@koa/router';
import got from 'got';
import {getDay, getWeek, getMonth, getAll, insert} from "./db/methods.js";

const app = new Koa();
const router = new Router();

const MS_IN_MINUTE = 60 * 1000;
const MS_IN_HOUR = 60 * 60 * 1000;

let lastRate = {};

const getRatePrice = async () => {
    try {
        const { payload: { rates } } = await got.get('https://api.tinkoff.ru/v1/currency_rates?from=EUR&to=RUB').json();
        return rates.find(rate => rate.category === 'OPSRateGroup').buy;
    } catch {
        return -1;
    }
};

const getCurrentRate = async () => {
    return {
        date: Date.now(),
        price: await getRatePrice(),
    };
}

(async function init() {
    lastRate = await getCurrentRate();

    const delayBeforeRunSaveHours = MS_IN_HOUR - (Date.now() % MS_IN_HOUR);
    let isNeedSaveHoursValue = false;
    setTimeout(() => {
        isNeedSaveHoursValue = true;
        setInterval(async () => {
            isNeedSaveHoursValue = true;
        }, MS_IN_HOUR)
    }, delayBeforeRunSaveHours);

    const delayBeforeRunInterval = MS_IN_MINUTE - (Date.now() % MS_IN_MINUTE);
    setTimeout(async () => {
        lastRate = await getCurrentRate();
        setInterval(async () => {
            lastRate = await getCurrentRate();
            if (isNeedSaveHoursValue) {
                isNeedSaveHoursValue = false;
                insert(lastRate.date, lastRate.price);
            }
        }, MS_IN_MINUTE)
    }, delayBeforeRunInterval);
})();

router.get('/day', async (ctx, next) => {
    ctx.body = await getDay();
    return next();
});

router.get('/week', async (ctx, next) => {
    ctx.body = await getWeek();
    return next();
});

router.get('/month', async (ctx, next) => {
    ctx.body = await getMonth();
    return next();
});

router.get('/all', async (ctx, next) => {
    ctx.body = await getAll();
    return next();
});

router.get('/last', (ctx, next) => {
    ctx.body = lastRate;
    return next();
});

router.get('/last-only-price', (ctx, next) => {
    ctx.body = lastRate.price;
    return next();
});

router.post('/refresh', async (ctx, next) => {
    lastRate = await getCurrentRate();
    ctx.body = lastRate;
    return next();
});

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000);
