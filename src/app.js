import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { buildContainer } from './container.js';
import { createApiRouter } from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const openApiPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
const openApiBase = YAML.load(openApiPath);

function clientProto(req) {
  const x = req.headers['x-forwarded-proto'];
  if (typeof x === 'string') return x.split(',')[0].trim();
  return req.protocol;
}

export function createApp() {
  const app = express();
  const { controllers } = buildContainer();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/api-docs/swagger.json', (req, res) => {
    const spec = structuredClone(openApiBase);
    const host = req.get('host');
    spec.servers = [{ url: `${clientProto(req)}://${host}/api` }];
    res.json(spec);
  });

  const swaggerOpts = {
    swaggerOptions: {
      url: '/api-docs/swagger.json',
    },
  };

  app.use(
    '/api-docs',
    ...swaggerUi.serveFiles(null, swaggerOpts),
    swaggerUi.setup(null, swaggerOpts)
  );

  app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use('/api', createApiRouter(controllers));
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
