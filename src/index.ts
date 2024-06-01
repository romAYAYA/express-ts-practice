import express, { Request, Response } from 'express'

export const app = express()
const port = process.env.PORT || 3000

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  NOT_FOUND: 404,
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const db = {
  products: [
    { id: 1, title: 'tomato' },
    { id: 2, title: 'orange' },
    { id: 3, title: 'juice' },
    { id: 4, title: 'laptop' },
  ],
}

app.get('/products', (req: Request, res: Response) => {
  let products = db.products

  if (req.query.title) {
    products = products.filter(
      (p) => p.title.indexOf(req.query.title as string) > -1
    )
  }

  res.json(products)
})

app.get('/products/:id', (req: Request, res: Response) => {
  const product = db.products.find((p) => p.id === +req.params.id)

  if (!product) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND)
    return
  }

  res.json(product)
})

app.post('/products', (req: Request, res: Response) => {
  if (!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
    return
  }

  const product = {
    id: +new Date(),
    title: req.body.title || 'unknown',
  }

  db.products.push(product)
  res.status(HTTP_STATUSES.CREATED_201).json(product)
})

app.delete('/products/:id', (req: Request, res: Response) => {
  db.products = db.products.filter((p) => p.id !== +req.params.id)

  res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

app.put('/products/:id', (req: Request, res: Response) => {
  if (!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
    return
  }

  const course = db.products.find((p) => p.id === +req.params.id)

  if (!course) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND)
    return
  }

  course.title = req.body.title

  res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

app.delete('/__test__/data', (req: Request, res: Response) => {
  db.products = []
  res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

app.listen(port, () => {
  console.log(`The app is Running on: http://localhost:${port}`)
})
