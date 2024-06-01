import request from 'supertest'
import { HTTP_STATUSES, app } from '../../src'

describe('/products', () => {
  beforeAll(async () => {
    await request(app).delete('/__test__/data')
  })

  it('should return 200 and empty array', async () => {
    await request(app).get('/products').expect(HTTP_STATUSES.OK_200, [])
  })

  it('should return 404 for not existing product', async () => {
    await request(app)
      .get('/products/989898989')
      .expect(HTTP_STATUSES.NOT_FOUND)
  })

  it("shouldn't create product with correct input data", async () => {
    await request(app)
      .post('/products')
      .send({ title: '' })
      .expect(HTTP_STATUSES.BAD_REQUEST)
  })

  let createdProduct: any = null
  it('should create product with correct input data', async () => {
    const createdRes = await request(app)
      .post('/products')
      .send({ title: 'duck' })
      .expect(HTTP_STATUSES.CREATED_201)

    createdProduct = createdRes.body

    expect(createdProduct).toEqual({
      id: expect.any(Number),
      title: 'duck',
    })

    await request(app)
      .get('/products')
      .expect(HTTP_STATUSES.OK_200, [createdProduct])
  })

  let createdProduct2: any = null
  it('should create one more product', async () => {
    const createdRes = await request(app)
      .post('/products')
      .send({ title: 'duck 2' })
      .expect(HTTP_STATUSES.CREATED_201)

    createdProduct2 = createdRes.body

    expect(createdProduct2).toEqual({
      id: expect.any(Number),
      title: 'duck 2',
    })

    await request(app)
      .get('/products')
      .expect(HTTP_STATUSES.OK_200, [createdProduct, createdProduct2])
  })

  it("shouldn't update product with correct input data", async () => {
    await request(app)
      .put('/products/' + createdProduct.id)
      .send({ title: '' })
      .expect(HTTP_STATUSES.BAD_REQUEST)

    await request(app)
      .get('/products/' + createdProduct.id)
      .expect(HTTP_STATUSES.OK_200, createdProduct)
  })

  it("shouldn't update product which doesn't exist", async () => {
    await request(app)
      .put('/products/' + -100)
      .send({ title: 'duck' })
      .expect(HTTP_STATUSES.NOT_FOUND)
  })

  it('should update product with correct input data', async () => {
    await request(app)
      .put('/products/' + createdProduct.id)
      .send({ title: 'new duck' })
      .expect(HTTP_STATUSES.NO_CONTENT)

    await request(app)
      .get('/products/' + createdProduct.id)
      .expect(HTTP_STATUSES.OK_200, {
        ...createdProduct,
        title: 'new duck',
      })

    await request(app)
      .get('/products/' + createdProduct2.id)
      .expect(HTTP_STATUSES.OK_200, createdProduct2)
  })

  it('should delete all products', async () => {
    await request(app)
      .delete('/products/' + createdProduct.id)
      .expect(HTTP_STATUSES.NO_CONTENT)

    await request(app)
      .get('/products/' + createdProduct.id)
      .expect(HTTP_STATUSES.NOT_FOUND)

    await request(app)
      .delete('/products/' + createdProduct2.id)
      .expect(HTTP_STATUSES.NO_CONTENT)

    await request(app)
      .get('/products/' + createdProduct2.id)
      .expect(HTTP_STATUSES.NOT_FOUND)

    await request(app)
      .get('/products/')
      .expect(HTTP_STATUSES.OK_200, [])
  })
})
