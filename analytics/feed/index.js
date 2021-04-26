import axios from 'axios';
import express from 'express'

const apiAuth = axios.create({ baseURL: 'http://localhost:3333' });
const apiProblems = axios.create({ baseURL: 'http://localhost:3334' });
const apiDelivery = axios.create({ baseURL: 'http://localhost:3335' });


const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const requestUser = () => {
    console.log('FEED USERS')
    const LEN = 5000;
    let countFinish = 0;

    const awaitFinish = async () => {
        while(1) {
            if (countFinish == LEN) {
                console.log('end: ', Date.now())
                break;
            }
            await delay(100)
        }
    }

    awaitFinish();
    console.log('init: ', Date.now())
    for (let i = 0; i < LEN; i++) {
        apiAuth.post('/users', generateUser()).then(() => { countFinish += 1 }).catch(() => { })
    }
}

const requestDelivery = async () => {
    console.log('FEED DELIVERIES:')
    const LEN = 5000;
    let countFinish = 0;

    const awaitFinish = async () => {
        while(1) {
            if (countFinish == LEN) {
                console.log('end: ', Date.now())
                break;
            }
            await delay(100)
        }
    }

    awaitFinish();
    console.log('init: ', Date.now())
    for (let i = 0; i < LEN; i++) {
        apiDelivery.post('/delivery', (await generateDelivery())).then(() => { countFinish += 1 }).catch(() => { })
    }
}

const requestProblems = async () => {
    console.log('FEED PROBLEMS:')
    const LEN = 5000;
    let countFinish = 0;

    const awaitFinish = async () => {
        while(1) {
            if (countFinish == LEN) {
                console.log('end: ', Date.now())
                break;
            }
            await delay(100)
        }
    }

    awaitFinish();
    console.log('init: ', Date.now())
    for (let i = 0; i < LEN; i++) {
        apiProblems.post('/problems', (await generateProblems())).then(() => { countFinish += 1 }).catch(() => { })
    }
}

const fetchLogin = async () => {
    console.log('FETCH LOGIN:')
    const LEN = 5000;
    let countFinish = 0;

    const awaitFinish = async () => {
        while(1) {
            if (countFinish == LEN) {
                console.log('end: ', Date.now())
                break;
            }
            await delay(100)
        }
    }

    awaitFinish();
    console.log('init: ', Date.now())
    for (let i = 0; i < LEN; i++) {
        apiAuth.post('/sessions', { email: 'admin@fastfeet.com', password: '123456' }).then(() => { countFinish += 1 }).catch(() => { })
    }
}

const fetchDeliveries = async () => {
    console.log('FETCH DELIVERIES:')
    const LEN = 5000;
    let countFinish = 0;

    const awaitFinish = async () => {
        while(1) {
            if (countFinish == LEN) {
                console.log('end: ', Date.now())
                break;
            }
            await delay(100)
        }
    }

    awaitFinish();
    console.log('init: ', Date.now())
    for (let i = 0; i < LEN; i++) {
        apiDelivery.get('/delivery').then(() => { countFinish += 1 }).catch(() => { })
    }
}

const fetchProblems = async () => {
    console.log('FETCH PROBLEMS:')
    const LEN = 5000;
    let countFinish = 0;

    const awaitFinish = async () => {
        while(1) {
            if (countFinish == LEN) {
                console.log('end: ', Date.now())
                break;
            }
            await delay(100)
        }
    }

    awaitFinish();
    console.log('init: ', Date.now())
    for (let i = 0; i < LEN; i++) {
        apiProblems.get('/problems').then(() => { countFinish += 1 }).catch(() => { })
    }
}

async function main() {
    const { data: { token } } = await apiAuth.post('/sessions', { email: 'admin@fastfeet.com', password: '123456' })
    console.log(token)
    apiAuth.defaults.headers.Authorization = `Bearer ${token}`
    apiProblems.defaults.headers.Authorization = `Bearer ${token}`
    apiDelivery.defaults.headers.Authorization = `Bearer ${token}`

    requestUser()
//    requestDelivery()
//    requestProblems()
//    fetchLogin()
//    fetchDeliveries()
//    fetchProblems()
}

function rnd(min, max) {
    return Math.floor(Math.random() * max) + min
}

function generateUser() {
    return {
        name: `${rnd(10000000000000000001, 99999999999999999999)}`,
        email: `${rnd(10000000000000000001, 99999999999999999999)}@fastfeet.com`,
        password: `${rnd(1000000001, 9999999999)}`,
    }
}

function generateDeliveryman() {
    const data = generateUser()
    delete data.password
    return data
}

function generateRecipient() {
    return {
        zip_code: rnd(10000000, 99999999),
        state: rnd(10000000, 99999999),
        city: rnd(10000000, 99999999),
        complement: rnd(10000000, 99999999),
        number: rnd(10000, 99999),
        street: rnd(10000000, 99999999),
        name: rnd(10000000000000000001, 99999999999999999999),
    }
}

async function generateDelivery() {
    const deliverymanId = (await apiDelivery.post('/deliverymen', generateDeliveryman())).data.id
    const recipientId = (await apiDelivery.post('/recipients', generateRecipient())).data.id

    return {
      deliveryman_id: deliverymanId,
      product: rnd(10000000000000000001, 99999999999999999999),
      recipient_id: recipientId,
    }
}

async function generateProblems() {
    const deliveryId = (await apiDelivery.post('/delivery', await generateDelivery())).data.id

    return {
        "delivery_id": deliveryId,
        "description": rnd(10000000000000000001, 99999999999999999999),
    }
}


main()

express().listen(9999)
