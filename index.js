function getSubObject (o, keysWithDot) {
  let rst = o
  const keys = keysWithDot.split('.')

  for (let key of keys) {
    if (rst[key] === undefined) {
      rst = undefined
      break
    }
    rst = rst[key]
  }

  return rst
}

function readableRoute (routes, app, middlewares, controllers) {
  const cleanRoutes = routes
  .replace(/^\s*\/\/.*$/gm, '')
  .replace(/^\s*[\r\n]/gm, '')
  .replace(/[ ]+/g, '')

  let curMiddlewares = []

  for (let row of cleanRoutes.split('\n')) {
    if (/\[[^\]]*\]/.test(row)) {
      const mws = row.slice(1, row.length - 1).split(',')
      for (let mw of mws) {
        if (mw === '') continue

        const m = getSubObject(middlewares, mw)
        if (m === undefined) {
          throw new Error(`${mw} not found in middlewares`)
        } else {
          curMiddlewares.push(m)
        }
      }
      continue
    }

    const [verb, path, controllerStr] = row.split(',')
    if (verb && path && controllerStr) {
      if (app[verb] === undefined) {
        throw new Error(`${verb} not found in app`)
      }

      const controller = getSubObject(controllers, controllerStr)
      if (controller === undefined) {
        throw new Error(`${controller} not found in controllers`)
      }

      const args = [path].concat(curMiddlewares).concat(controller)
      Reflect.apply(app[verb], app, args)
    }
  }
}

// export for test
readableRoute.getSubObject = getSubObject

module.exports = readableRoute
