function readableRoute (routes, app, middlewares, controllers) {
  const cleanRoutes = routes
  .replace(/^\s*\/\/.*$/gm, '')
  .replace(/^\s*[\r\n]/gm, '')
  .replace(/[ ]+/g, '')

  let curMiddlewares = []

  for (let row of cleanRoutes.split('\n')) {
    if (/\[[^\]]*\]/.test(row)) {
      curMiddlewares = row.slice(1, row.length - 1).split(',')
      continue
    }

    const [verb, path, controller] = row.split(',')
    if (verb && path && controller) {
      if (app[verb] === undefined) {
        throw new Error(`${verb} not found in app`)
      }

      if (controllers[controller] === undefined) {
        throw new Error(`${controller} not found in controllers`)
      }

      const args = [path].concat(curMiddlewares).concat(controllers[controller])
      Reflect.apply(app[verb], app, args)
    }
  }
}

module.exports = readableRoute
