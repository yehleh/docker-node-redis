const express = require('express');
const redis = require('redis');

const app = express();
console.log(process.env.REDIS_HOST);
const client = redis.createClient({url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`});

(async () => {
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect()
})();

// Route to fetch data with caching
app.get('/data', async (req, res) => {
    const key = 'random_num';
    console.log('data request')

    const cachedData = await client.get(key);
    
    if (cachedData) {
        // Data found in cache, return it
        await client.set(key, Math.floor(Math.random()*100));
        res.json({source: 'cache', data: JSON.parse(cachedData)});
    } else {
        const data = {message: 'Hello, Redis!'};
        // Store data in cache for next request
        await client.set(key, Math.random()*100, JSON.stringify(data));
        res.json({source: 'database', data});
    }
});

app.get('/count', async (req, res) => {
    const key = 'count';
    console.log('count request')

    const cachedData = await client.get(key);
    
    if (cachedData != null) {
        // Data found in cache, return it
        console.log("count: ", cachedData)
        console.log("cacheData parsed: ", Number.parseInt(cachedData), "type: ", typeof(cachedData))
        client.set(key, Number.parseInt(cachedData) + 1)
        res.json({source: 'cache', count: cachedData});
    } else {
        client.set(key,Number.parseInt(1));
        res.json({source: 'cache', count: 1});
        // res.json({source: 'error', message:"No key found in redis"});
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});