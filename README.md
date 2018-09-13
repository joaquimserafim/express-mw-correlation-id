# express-mw-correlation-id

Correlates HTTP requests between a client and server

<a href="https://nodei.co/npm/express-mw-correlation-id/"><img src="https://nodei.co/npm/express-mw-correlation-id.png?downloads=true"></a>

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](https://travis-ci.org/joaquimserafim/express-correlation-id)![Code Coverage 100%](https://img.shields.io/badge/code%20coverage-100%25-green.svg?style=flat-square)[![ISC License](https://img.shields.io/badge/license-ISC-blue.svg?style=flat-square)](https://github.com/joaquimserafim/express-correlation-id/blob/master/LICENSE)[![NodeJS](https://img.shields.io/badge/node-6.1.x-brightgreen.svg?style=flat-square)](https://github.com/joaquimserafim/express-correlation-id/blob/master/package.json#L48)

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


### api
`const setCorrelationId = require('express-mw-correlation-id')`

**setCorrelationId([string, defaults to X-Request-ID], [formatter=identity])
* by default will use the `X-Request-ID` header but to use a custom header instead just pass the name in the first parameter
* formatter is a function that will add custom formats to the generated ID, being, by default, the generated ID.
* the middleware will reuse the request id if already present in the request headers

**req.id** now is expose to be used internally by the api/service is using the `express-mw-correlation-id` middleware

### examples

```js
const express = require('express')
const setCorrelationId = require('express-mw-correlation-id')

const app = express()

app.use(setCorrelationId())

// `req.id` hold the correlation/request id
app.get('/', (req, res) => { res.send(req.id) })

app.listen(3000)
```

#### Custom ID
```js
app.use(setCorrelationId('X-Custom-ID'))
```

#### Custom ID and custom format
```js
app.use(setCorrelationId('X-Custom-ID', (id) => id))
```

#### Custom format
```js
app.use(setCorrelationId((id) => id))
```

client
```sh
curl -v http://localhost:3000
* Rebuilt URL to: http://localhost:3000/
*   Trying ::1...
* Connected to localhost (::1) port 3000 (#0)
> GET / HTTP/1.1
> Host: localhost:3000
> User-Agent: Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)
> Accept: */*
> Referer:
>
< HTTP/1.1 200 OK
< X-Powered-By: Express
< X-Request-ID: 825efe65-a27d-4dca-936b-e74249095fb7
< Content-Type: text/html; charset=utf-8
< Content-Length: 11
< ETag: W/"b-sQqNsWTgdUEFt6mb5y4/5Q"
< Date: Thu, 08 Dec 2016 10:22:44 GMT
< Connection: keep-alive
<
* Connection #0 to host localhost left intact
825efe65-a27d-4dca-936b-e74249095fb7
```

**X-Request-ID** should come with the headers


### ISC License (ISC)
