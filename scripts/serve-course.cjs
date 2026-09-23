const http = require('node:http');
const path = require('node:path');
const serveHandler = require('serve-handler');
const { applyTrailingSlash } = require('@docusaurus/utils-common');

const ISOLATION_HEADERS = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};

function option(args, name, fallback) {
  const direct = args.find((value) => value.startsWith(`${name}=`));
  if (direct) return direct.slice(name.length + 1);
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
}

function redirect(response, location) {
  response.writeHead(302, { Location: location });
  response.end();
}

async function serveCourse({ siteDir, args = [] }) {
  const docusaurusDir = path.dirname(require.resolve('@docusaurus/core/package.json'));
  const { loadSiteConfig } = require(path.join(docusaurusDir, 'lib/server/config.js'));
  const { siteConfig: { baseUrl, trailingSlash } } = await loadSiteConfig({ siteDir });
  const host = option(args, '--host', 'localhost');
  const port = Number(option(args, '--port', '3000'));
  const outDir = path.resolve(siteDir, option(args, '--dir', 'build'));

  const server = http.createServer((request, response) => {
    for (const [name, value] of Object.entries(ISOLATION_HEADERS)) response.setHeader(name, value);

    if (!request.url?.startsWith(baseUrl)) {
      redirect(response, baseUrl);
      return;
    }
    if (baseUrl !== '/') {
      const looksLikeAsset = !!request.url.match(/\.[a-zA-Z\d]{1,4}$/);
      if (!looksLikeAsset) {
        const normalizedUrl = applyTrailingSlash(request.url, { trailingSlash, baseUrl });
        if (request.url !== normalizedUrl) {
          redirect(response, normalizedUrl);
          return;
        }
      }
    }

    request.url = request.url.replace(baseUrl, '/');
    serveHandler(request, response, {
      cleanUrls: true,
      public: outDir,
      trailingSlash,
      directoryListing: false,
    }).catch((error) => {
      console.error(error);
      if (!response.headersSent) response.writeHead(500);
      response.end('Internal server error');
    });
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });
  const address = server.address();
  const actualPort = typeof address === 'object' && address ? address.port : port;
  console.log(`Serving build with browser isolation at http://${host}:${actualPort}${baseUrl}`);
  return server;
}

module.exports = { ISOLATION_HEADERS, serveCourse };
