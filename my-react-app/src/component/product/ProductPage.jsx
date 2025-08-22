import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

import RelatedProduct from './RelatedProduct';
import ProductPagePlaceHolder from './ProductPagePlaceHolder';
import { toast } from 'react-toastify';

const ProductsPage = ({ setNumCartItems }) => {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);

  const cartCode = localStorage.getItem("cart_code");

  // Generate cart code if not present
  useEffect(() => {
    if (!cartCode) {
      const newCode = Math.random().toString(36).substring(2, 11).toUpperCase();
      localStorage.setItem("cart_code", newCode);
    }
  }, [cartCode]);

  // Fetch product details
  useEffect(() => {
    setInCart(false);
    setLoading(true);

    api.get(`/product-detail/${slug}/`)
      .then(res => {
        const data = res.data;
        setProduct(data);
        setSimilarProducts(Array.isArray(data.similar_products) ? data.similar_products : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch product error:', err.message);
        setLoading(false);
      });
  }, [slug]);

  // Check if product is already in cart
  useEffect(() => {
    if (!product?.id || !cartCode) return;

    api.get(`check_product_in_cart/?cart_code=${cartCode}&product_id=${product.id}`)
      .then(res => setInCart(res.data.check_product_in_cart))
      .catch(err => console.error('Check cart error:', err.message));
  }, [cartCode, product]);

  // Add item to cart
  const addToCart = () => {
    if (!product?.id || !cartCode) return;

    const newItem = {
      cart_code: cartCode,
      product_id: product.id,
      quantity: quantity > 0 ? quantity : 1,
    };

    api.post("/add_item/", newItem)
      .then(() => {
        setInCart(true);
        toast.success("Product Added to Cart");
        // Fetch latest cart stats and update count
        api.get(`get_cart_stat?cart_code=${cartCode}`)
          .then(res => {
            if (setNumCartItems) setNumCartItems(res.data.num_of_items);
          })
          .catch(err => {
            console.error('Failed to update cart count:', err.message);
          });
      })
      .catch(err => {
        console.error('Add to cart failed:', err.response?.data || err.message);
      });
  };

  if (loading) return <ProductPagePlaceHolder />;
  if (!product) return <div className="alert alert-danger">Product not found.</div>;

  return (
    <div>
      <section className="py-3">
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">
            <div className="col-md-6">
              <img
                className="card-img-top mb-3 mb-md-0"
                src={product.image ? `${api.defaults.baseURL}${product.image}` : '/img/placeholder.jpg'}
                alt={product.name || 'Product'}
              />

              {/* ✅ Extra product images */}
              <div className="d-flex flex-wrap gap-2 mt-2">
                {product.extra_images && product.extra_images.length > 0 ? (
                  product.extra_images.map((imgObj, index) => (
                    <img
                      key={index}
                      src={`${api.defaults.baseURL}${imgObj.image}`}
                      alt={`Extra ${index + 1}`}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                      }}
                    />
                  ))
                ) : (
                  <p className="text-muted">No additional images</p>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="small mb-1">SKU: {product.sku || 'N/A'}</div>
              <h1 className="display-5 fw-bolder">{product.name}</h1>
              <div className="fs-5 mb-5">₦{product.price}</div>

              <p className="lead">
                {product.description || "No description available."}
              </p>

              <div className="d-flex">
                <input
                  type="number"
                  min="1"
                  className="form-control text-center me-3"
                  style={{ maxWidth: '3rem' }}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
                />

                <button
                  className="btn btn-outline-dark flex-shrink-0"
                  type="button"
                  onClick={addToCart}
                  disabled={inCart}
                >
                  <i className="bi-cart-fill me-1"></i>
                  {inCart ? "Product added to cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedProduct products={similarProducts} />
    </div>
  );
};

export default ProductsPage;
