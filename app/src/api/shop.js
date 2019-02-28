/**
 * Mocking client-server processing
 */
import _products from './data.json'
import fashion from './fashion'
import raw from './raw_material'

const TIMEOUT = 0

export default {
    getProducts: (cb, timeout) => setTimeout(() => cb(_products), timeout || TIMEOUT),
    getFashionCategoryProducts: (cb, timeout) =>  cb(fashion),
    getRawMaterialCategoryProducts: (cb, timeout) =>  cb(raw),

    buyProducts: (payload, cb, timeout) => setTimeout(() => cb(), timeout || TIMEOUT)
}
