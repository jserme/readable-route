/* eslint-env mocha */
const applyRouter = require('../')
const assert = require('assert')

const routeDes = `
    //first path and route collection
    [m1, m2, m3]
    get,    /path1,    c1
    patch,  /path1,  c2

    //another path and route collection
[m4, m5, m6]
    get, /path2,     c3
[]
delete,     /path5,   c4

[m1,  m3,      m4]
delete,     /path5,   c3
`

const middlewares = {
  m1: () => {},
  m2: () => {},
  m3: () => {},
  m4: () => {},
  m5: () => {},
  m6: () => {}
}

const controllers = {
  c1: () => {},
  c2: () => {},
  c3: () => {},
  c4: () => {}
}

let count = 0
const stub = () => {
  return count++
}

const app = {
  'get': stub,
  'post': stub,
  'patch': stub,
  'delete': stub
}

describe('readable-route', () => {
  it('route add success', () => {
    applyRouter(routeDes, app, middlewares, controllers)
    assert(count === 5)
  })
})
