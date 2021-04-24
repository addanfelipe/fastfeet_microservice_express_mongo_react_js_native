import axios from 'axios';
import express from 'express'

const apiAuth = axios.create({ baseURL: 'http://localhost:3333' });
const apiProblems = axios.create({ baseURL: 'http://localhost:3334' });
const apiDelivery = axios.create({ baseURL: 'http://localhost:3335' });


const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const requestUser = () => {
    const LEN = 1000;
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

const requestDelivery = () => {
    const LEN = 1000;
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
        //apiAuth.post('/users', generateUser()).then(() => { countFinish += 1 }).catch(() => { })
    }
}

const requestProblems = () => {
    const LEN = 1000;
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
        //apiAuth.post('/users', generateUser()).then(() => { countFinish += 1 }).catch(() => { })
    }
}

async function main() {
    const { data: { token } } = await apiAuth.post('/sessions', { email: 'admin@fastfeet.com', password: '123456' })
    console.log(token)
    apiAuth.defaults.headers.Authorization = `Bearer ${token}`
    apiProblems.defaults.headers.Authorization = `Bearer ${token}`
    apiDelivery.defaults.headers.Authorization = `Bearer ${token}`

    requestUser() // substituir pela que quiser chamar
}

function rnd(min, max) {
    return Math.floor(Math.random() * max) + min
}

function generateUser() {
    return {
        name: rnd(10000000000000000001, 99999999999999999999),
        email: `${rnd(10000000000000000001, 99999999999999999999)}@fastfeet.com`,
        password: rnd(1000000001, 9999999999),
    }
}

function generateDelivery() {
    return {
    }
}

function generateProblems() {
    return {
    }
}


main()

express().listen(9999)
