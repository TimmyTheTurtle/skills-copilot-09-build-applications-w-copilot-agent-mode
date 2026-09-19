import express from 'express'
import { getApiBaseUrl, port } from './config/apiUrl.js'
import { connectDatabase } from './config/database.js'
import { apiRouter } from './routes/api.js'

const app = express()

app.use(express.json())
app.use('/api', apiRouter)

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

await connectDatabase()

app.listen(port, () => {
  console.log(`OctoFit API listening on port ${port}`)
  console.log(`OctoFit API base URL: ${getApiBaseUrl()}`)
})