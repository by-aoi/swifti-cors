import { type Context, Middleware } from 'swifti'

export interface CorsOptions {
	allowedMethods?: string | string[]
	allowedOrigins?: string | string[]
	allowedHeaders?: string | string[]
	maxAge?: number
	exposedHeaders?: string | string[]
	successStatus?: number
	credentials?: boolean
	preflightContinue?: boolean
}

const defaultOptions = {
	allowedMethods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
	allowedOrigins: '*',
	allowedHeaders: '*',
	maxAge: 600,
	successStatus: 204,
	credentials: false,
}

function configAllowedOrigins(ctx: Context, allowedOrigins: string | string[]) {
	const { origin } = ctx.req.headers
	if (!origin) return
	if (typeof allowedOrigins === 'string') allowedOrigins = [allowedOrigins]
	const allowedAllOrigins = allowedOrigins.includes('*')
	const allowedOrigin = allowedOrigins.includes(origin)
	if (allowedAllOrigins || allowedOrigin) {
		ctx.res.setHeader('Access-Control-Allow-Origin', origin)
		return
	}
	ctx.res.setHeader('Access-Control-Allow-Origin', 'false')
}

function configAllowedMethods(ctx: Context, methods: string | string[]) {
	if (typeof methods === 'string') methods = [methods]
	ctx.res.setHeader('Access-Control-Allow-Methods', methods.join(','))
}

function configCredentials(ctx: Context, credentials: boolean) {
	if (credentials) {
		ctx.res.setHeader('Access-Control-Allow-Credentials', 'true')
	}
}

function configAllowedHeaders(ctx: Context, allowedHeaders: string | string[]) {
	if (typeof allowedHeaders === 'string') allowedHeaders = [allowedHeaders]
	if (allowedHeaders.includes('*')) {
		ctx.res.setHeader(
			'Access-Control-Allow-Headers',
			ctx.req.headers['access-control-request-headers'] ?? '*'
		)
		return
	}
	allowedHeaders = allowedHeaders.filter(header => header !== '*')
	ctx.res.setHeader('Access-Control-Allow-Headers', allowedHeaders)
}

function configExposedHeaders(ctx: Context, exposedHeaders?: string | string[]) {
	if (!exposedHeaders) return
	if (typeof exposedHeaders === 'string') exposedHeaders = [exposedHeaders]
	ctx.res.setHeader('Access-Control-Expose-Headers', exposedHeaders.join(','))
}

function configMaxAge(ctx: Context, maxAge?: number) {
	if (!maxAge) return
	ctx.res.setHeader('Access-Control-Max-Age', maxAge.toString())
}

export default function cors(options: CorsOptions = {}) {
	return new Middleware((ctx, next) => {
		configAllowedOrigins(ctx, options.allowedOrigins ?? defaultOptions.allowedOrigins)
		configCredentials(ctx, options.credentials ?? defaultOptions.credentials)
		configExposedHeaders(ctx, options.exposedHeaders)
		if (ctx.req.method === 'OPTIONS') {
			configAllowedMethods(ctx, options.allowedMethods ?? defaultOptions.allowedMethods)
			configAllowedHeaders(ctx, options.allowedHeaders ?? defaultOptions.allowedHeaders)
			configMaxAge(ctx, options.maxAge ?? defaultOptions.maxAge)
			if (options.preflightContinue) return next()
			ctx.res
				.status(options.successStatus ?? 204)
				.setHeader('Content-Length', '0')
				.end()
			return
		}
		next()
	})
}
