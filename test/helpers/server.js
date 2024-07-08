import path from 'path'
import url from 'url'
import http from 'http'
import handler from 'serve-handler'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const publicRoot = path.join(__dirname, '..', '..')

const rewrites = [
  { source: 'favicon.ico', destination: '/test/assets/index.html' }
]

export default function createServer() {
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: publicRoot,
      rewrites
    })
  })

  server.listen(5000, () => {
    console.log('Serving at http://localhost:5000')
  })

  return () => server.close(() => console.log('Server closed'))
}
