# readable-route

for more readable route define

you can write route like this

```
[login]
get, /profile, showProfile

[oauth, checkPremission]
post, /api/a, apiA
get, /api/b, apiB
```

`readable-route` make it equal to 

```javascript
app.get('/profile', middlewares.login, controllers.showProfile)
app.post('/api/a', middlewares.oauth, middlewares.checkPremission, controllers.apiA)
app.get('/api/b', middlewares.oauth, middlewares.checkPremission, controllers.apiB)
```

### Useage

```javascript
const readableRoute = require('readable-route') 
const {middlewares, controllers} = context
const routes = `
    // / not need middleware
    get,  /, index
    [login]
        get, /profile, showProfile

    //another comment
    [oauth, checkPremission]
        post, /api/a, apiA
        get, /api/b, apiB
`

readableRoute(routes, app, middlewares, controllers)
```
