import { db } from '../db/db'

export const testsRepository = {
  deleteProducts() {
    db.products = []
  },
}
