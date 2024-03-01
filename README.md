# @swifti/cors

> Handle CORS (Cross-Origin Resource Sharing) in Swifti applications.

## Installation

```bash
npm install @swifti/cors
```

## Use

```ts
import { Route } from 'swifti'
import cors from '@swifti/cors'

const route = new Route().use(cors(/* options */))
```

## Options

- `allowedMethods`: Specifies the HTTP methods allowed in CORS requests. By default, GET, HEAD, PUT, PATCH, POST, DELETE, and OPTIONS are allowed.

- `allowedOrigins`: Specifies the allowed sources for CORS requests. By default, any origin ('\*') is allowed.

- `allowedHeaders`: Specifies the headers allowed in CORS requests. By default, all headers ('\*') are allowed.

- `maxAge`: Specifies the maximum time (in seconds) that the result of a CORS request can be cached. By default, it is set to 600 milliseconds.

- `exposedHeaders`: Specifies custom headers that the server can expose in the CORS response.

- `successStatus`: Specifies the success status code for OPTIONS requests. By default, it is set to 204.

- `credentials`: Indicates whether credentials are allowed in CORS requests. By default, it is set to false.

- `preflightContinue`: Indicates whether the middleware should continue handling after the OPTIONS request. By default, it is set to false.

## Example

```ts
// filename: /middlewares.ts
import cors, { type CorsOptions } from '@swifti/cors'

const options: CorsOptions = {
	allowedMethods: ['GET', 'POST'],
	allowedOrigins: ['http://example.com', 'https://example.com'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	maxAge: 3600,
	exposedHeaders: ['Content-Length', 'X-Request-ID'],
	successStatus: 200,
	credentials: true,
	preflightContinue: true,
}

export default [cors(options)]
```

## License

[MIT License](https://github.com/by-aoi/swifti/blob/main/LICENSE)
