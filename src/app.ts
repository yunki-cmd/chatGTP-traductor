import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
const app = express()
app.use(express.json());

import {Promts } from './types/types'

import {getResponseGPT, getResponseGPTCode} from './services/requestApiGTP'

app.use('/',express.static('public'));


app.get('/chat', async function (req: express.Request, res: express.Response) {

  const message = req.query.message
  let idiomas = req.query.idiomas
  if(idiomas == null) idiomas = 'ingles'
  const response:any = await getResponseGPT(message, idiomas)

  if (!response.ok) {
    console.error(response.statusText)
    return res.status(500).json({ error: 'Something went wrong' })
  }

  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache, no-transform',
    'Content-Encoding': 'none',
    'Content-Type': 'text/event-stream; charset=utf-8'
  })
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf8');
  
  while (true) {
    
    // el value no es un string, sino son bits
    const { done, value } = await reader.read()

    // codificamos el bit a un string utf8
    const chunk = decoder.decode(value)
    
    if (done) {
      // cerrar la respuesta
      return res.end('data: [DONE]\n\n');
    }

    const [data] = chunk
      .split(/\n/)
      .filter(Boolean)
      .map(line => line.replace('data: ', '').trim())
    
    if (data === '[DONE]') {
      return res.end('data: [DONE]\n\n');
    }

    try {
      const json = JSON.parse(data)
      const { content } = json.choices?.[0]?.delta
      console.log({ content })
      content && res.write(`data: ${JSON.stringify(content)}\n\n`)
    } catch (error) {
      console.log(data)
      console.error(error)
    }
  }
  
})

app.get('/chat/code', async function (req: express.Request, res: express.Response) {
  
  const body: Promts[] = JSON.parse(req.query.body)
  

  if (null != body) { 
    const response: any = await getResponseGPTCode(body)

    if (!response.ok) {
      console.error(response.statusText)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Encoding': 'none',
      'Content-Type': 'text/event-stream; charset=utf-8'
    })
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf8');
    
    while (true) {
      
      // el value no es un string, sino son bits
      const { done, value } = await reader.read()
  
      // codificamos el bit a un string utf8
      const chunk = decoder.decode(value)

      if (done) {
        // cerrar la respuesta
        return res.end('data: [DONE]\n\n');
      }
  
      const [data] = chunk
        .split(/\n/)
        .filter(Boolean)
        .map(line => line.replace('data: ', '').trim())
      
      if (data === '[DONE]') {
        return res.end('data: [DONE]\n\n');
      }
  
      try {
        const json = JSON.parse(data)
        const { content } = json.choices?.[0]?.delta
        content && res.write(`data: ${JSON.stringify(content)}\n\n`)
      } catch (error) {
        console.error(error)
      }
    }
  }
})


app.listen(3000)