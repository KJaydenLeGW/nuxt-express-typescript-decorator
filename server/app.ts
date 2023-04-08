import 'reflect-metadata'
//import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
//import morgan from 'morgan'
import { useExpressServer, getMetadataArgsStorage } from 'routing-controllers'
import { routingControllersToSpec } from 'routing-controllers-openapi'
import swaggerUi from 'swagger-ui-express'
// import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config'
// import errorMiddleware from '@middlewares/error.middleware'
// import { logger, stream } from '@utils/logger'

const ORIGIN = '*'
const CREDENTIALS = true



const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')


const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

import { Container } from 'typedi'

// Important to import like this for Service() decorators to be executed
import './services'
//import routes from './routes'

// Set console as Logger
Container.set('Logger', console)

class App {
    public app: express.Application
    public port: number
    public host: string
    private nuxt: any

    constructor(Controllers: Function[]) {

        //constructor() {
        this.app = express()

        this.initializeMiddlewares()
        this.initializeRoutes(Controllers)
        this.initializeSwagger(Controllers)
        //this.initializeErrorHandling()


        // Init Nuxt.js
        this.nuxt = new Nuxt(config)

        this.host = this.nuxt.options.server.host
        this.port = Number(this.nuxt.options.server.port)
    }

    public async listen() {


        await this.nuxt.ready()
        // Build only in dev mode
        if (config.dev) {
            const builder = new Builder(this.nuxt)
            await builder.build()
        }

        // Setup routes
        //this.app.use('/api', routes)

        // Give nuxt middleware to express
        this.app.use(this.nuxt.render)


        this.app.listen(this.port, this.host)
        consola.ready({
            message: `Server listening on http://${this.host}:${this.port}`,
            badge: true,
        })

    }

    public getServer() {
        return this.app
    }

    private initializeMiddlewares() {
        //this.app.use(morgan(LOG_FORMAT, { stream }))
        this.app.use(hpp())
        this.app.use(helmet())
        this.app.use(compression())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cookieParser())
    }

    private initializeRoutes(controllers: Function[]) {
        useExpressServer(this.app, {
            // cors: {
            //     origin: ORIGIN,
            //     credentials: CREDENTIALS,
            // },
            controllers: controllers,
            defaultErrorHandler: false,
        })
    }

    private initializeSwagger(controllers: Function[]) {
        // const schemas = validationMetadatasToSchemas({
        //     refPointerPrefix: '#/components/schemas/',
        // })

        const routingControllersOptions = {
            controllers: controllers,
        }

        const storage = getMetadataArgsStorage()
        const spec = routingControllersToSpec(storage, routingControllersOptions, {
            components: {
                securitySchemes: {
                    basicAuth: {
                        scheme: 'basic',
                        type: 'http',
                    },
                },
            },
            info: {
                description: 'Generated with `routing-controllers-openapi`',
                title: 'A sample API',
                version: '1.0.0',
            },
        })

        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec))
    }

}

export default App
