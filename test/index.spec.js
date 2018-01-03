/* eslint-env mocha */
const readableRoute = require('../')
const assert = require('power-assert')

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

const reset = () => {
  count = 0
}

const app = {
  'get': stub,
  'post': stub,
  'patch': stub,
  'delete': stub
}

describe('readable-route', () => {
  beforeEach(() => {
    reset()
  })

  it('normal add success', () => {
    const routes = `
    [m1, m2, m3]
    get,    /path1,    c1
    patch,  /path1,  c2

    [m1]
    get,    /path3,    c3
    patch,  /path4,  c4
`
    readableRoute(routes, app, middlewares, controllers)
    assert(count === 4)
  })

  it('// comment support', () => {
    const routes = `
    //another path and route collection
[m4, m5,  m6]
    get, /path2,     c3

    //comment2
[m4]
delete,     /path5,   c4
    `
    readableRoute(routes, app, middlewares, controllers)
    assert(count === 2)
  })

  it('empty middware define', () => {
    const routes = `
[m4, m5, m6]
    get, /path2,     c3
[]
delete,     /path5,   c4

[m1,  m3,      m4]
delete,     /path5,   c3
    `
    readableRoute(routes, app, middlewares, controllers)
    assert(count === 3)
  })

  it('get child object ', () => {
    const o = {
      m1: {
        m2: {
          m3: () => {}
        }
      }
    }

    assert(readableRoute.getSubObject(o, 'm1.m2.m3'))
    assert(readableRoute.getSubObject(o, '') === undefined)
    assert(readableRoute.getSubObject(o, 'm4.m4') === undefined)
    assert(readableRoute.getSubObject({}, 'm4.m4') === undefined)
  })

  it('child object support', () => {
    const cm = {
      m1: {
        m2: {
          m3: () => {}
        }
      }
    }

    const cc = {
      c1: {
        c2: {
          c3: () => {}
        }
      }
    }

    const routes = `
      [m1.m2.m3]
      get, /path2,     c1.c2.c3
    `

    readableRoute(routes, app, cm, cc)
    assert(count === 1)
  })
})
