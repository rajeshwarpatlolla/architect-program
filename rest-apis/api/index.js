const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiGood = require('@hapi/good');
const HapiSwagger = require('hapi-swagger');
const mongoose = require('mongoose');

const config = require('./config');
const routes = require('./routes');
const pack = require('./package.json');

mongoose.connect(config.database.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const init = async () => {
  const server = Hapi.server({
    host: config.server.host,
    port: config.server.port,
    routes: {
      cors: true,
      validate: {
        // If any Joi validations fail, it will send the proper error message to the user
        failAction: (request, h, error) => {
          throw error;
        },
      },
    },
  });

  const swaggerOptions = {
    info: {
      title: config.swagger.title,
      version: pack.version,
      contact: {
        name: config.swagger.contact,
      },
    },
    schemes: ['http', 'https'],
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    security: [{ jwt: [] }],
  };

  const goodOptions = {
    ops: {
      interval: 1000,
    },
    reporters: {
      console: [
        {
          module: '@hapi/good-squeeze',
          name: 'Squeeze',
          args: [{ log: '*', response: '*', ops: '*' }],
        },
        {
          module: '@hapi/good-console',
        },
        'stdout',
      ],
    },
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
    {
      plugin: HapiGood,
      options: goodOptions,
    },
  ]);

  try {
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
    console.log(`Swagger documentation is running on ${server.info.uri}/documentation`);
  } catch (error) {
    console.log(error);
  }
  server.route(routes);

  server.ext('onPostAuth', async (req, h) => h.continue);
};

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to DB.');
  init();
});

db.on('error', (error) => {
  console.log('Connection to DB failed!', error);
  process.exit(0);
});

db.on('disconnected', (error) => {
  console.log('Connection teminated to DB ', error);
  process.exit(0);
});

process.on('unhandledRejection', (error) => {
  console.error(error);
  process.exit(1);
});

// init();
