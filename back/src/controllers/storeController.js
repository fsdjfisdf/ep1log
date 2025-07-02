const productDao = require('../dao/productDao');
const purchaseDao = require('../dao/purchaseDao');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productDao.getAllProducts();
    res.json(products);
  } catch (err) {
    console.error('getAllProducts error:', err);
    res.status(500).json({ error: '제품 목록 불러오기 실패' });
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const product = await productDao.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: '제품을 찾을 수 없습니다' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: '상세 정보 불러오기 실패' });
  }
};

exports.requestPurchase = async (req, res) => {
  try {
    const { product_id, buyer_name, phone, address, message } = req.body;
    await purchaseDao.createPurchase({ product_id, buyer_name, phone, address, message });
    res.json({ message: '구매 요청이 완료되었습니다. 계좌이체 후 입금 확인까지 1~2일 소요됩니다.' });
  } catch (err) {
    console.error('requestPurchase error:', err);
    res.status(500).json({ error: '구매 요청 처리 중 오류' });
  }
};

exports.registerProduct = async (req, res) => {
  try {
    const { name, price, description, image_urls } = req.body;

    // image_urls는 JSON 배열이어야 함
    const imageUrlsString = JSON.stringify(image_urls);

    await productDao.createProduct({ name, price, description, image_urls: imageUrlsString });
    res.json({ message: '상품 등록 완료' });
  } catch (err) {
    console.error('registerProduct error:', err);
    res.status(500).json({ error: '상품 등록 실패' });
  }
};
