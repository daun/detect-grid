import path from 'node:path'
import url from 'node:url'
import http from 'node:http'
import handler from 'serve-handler'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const publicRoot = path.join(__dirname, '..', '..')

const rewrites = [{ source: 'favicon.ico', destination: '/test/assets/index.html' }]

export default function createServer(): () => void {
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: publicRoot,
      rewrites
    })
  })

  server.listen(5678, () => {
    console.log('Serving at http://localhost:5678')
  })

  return () => server.close(() => console.log('Server closed'))
}
