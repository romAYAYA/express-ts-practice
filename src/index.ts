import express from 'express'

const app = express()
const port = 3000

const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  NOT_FOUND: 404,
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const db = {
  courses: [
    { id: 1, title: 'front-end' },
    { id: 2, title: 'back-end' },
    { id: 3, title: 'automation qa' },
    { id: 4, title: 'devops' },
  ],
}

app.get('/courses', (req, res) => {
  let courses = db.courses

  if (req.query.title) {
    courses = courses.filter(
      (c) => c.title.indexOf(req.query.title as string) > -1
    )
  }

  res.json(courses)
})
app.get('/courses/:id', (req, res) => {
  const course = db.courses.find((c) => c.id === +req.params.id)

  if (!course) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND)
    return
  }

  res.json(course)
})
app.post('/courses', (req, res) => {
  if (!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
    return
  }

  const course = {
    id: +new Date(),
    title: req.body.title || 'unknown',
  }

  db.courses.push(course)
  res.status(HTTP_STATUSES.CREATED_201).json(course)
})
app.delete('/courses/:id', (req, res) => {
  db.courses = db.courses.filter((c) => c.id !== +req.params.id)

  res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})
app.put('/courses/:id', (req, res) => {
  if (!req.body.title) {
    res.sendStatus(HTTP_STATUSES.BAD_REQUEST)
    return
  }

  const course = db.courses.find((c) => c.id === +req.params.id)

  if (!course) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND)
    return
  }

  course.title = req.body.title

  res.sendStatus(HTTP_STATUSES.NO_CONTENT)
})

app.listen(port, () => {
  console.log(`Port: ${port}`)
})
