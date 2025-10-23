// ...existing code...
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import RelatedProduct from './RelatedProduct';
import ProductPagePlaceHolder from './ProductPagePlaceHolder';
import { toast } from 'react-toastify';

const fallbackImageUrl = 'https://via.placeholder.com/800x600?text=No+Image';
const cloudinaryBaseUrl = 'https://res.cloudinary.com/dorjc6aib/';

const ProductsPage = ({ setNumCartItems }) => {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [mainImage, setMainImage] = useState(fallbackImageUrl);

  const cartCode = localStorage.getItem("cart_code");

  // Normalize value that may be string or object { image: '...' }
  const normalizePath = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && val.image) return val.image;
    return '';
  };

  // Build absolute image URL

  const getImageUrl = (imagePath) => {
    const path = normalizePath(imagePath);
    if (!path) return fallbackImageUrl;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;

    // Cloudinary public id or path like "image/upload/..."

    if (path.includes('image/upload') || path.includes('cloudinary')) {
      return path.startsWith('http') ? path : cloudinaryBaseUrl + path.replace(/^\/+/, '');
    }

    // relative backend media path like /media/..., uploads/..., or simple filename

    const backendBaseUrl = (api?.defaults?.baseURL || '').replace(/\/$/, '');
    if (!backendBaseUrl) return fallbackImageUrl;
    return backendBaseUrl + (path.startsWith('/') ? '' : '/') + path;
  };

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = fallbackImageUrl;
  };

  useEffect(() => {
    if (!cartCode) {
      const newCode = Math.random().toString(36).substring(2, 11).toUpperCase();
      localStorage.setItem("cart_code", newCode);
    }
  }, [cartCode]);

  useEffect(() => {
    setInCart(false);
    setLoading(true);
    api.get(`/product-detail/${slug}/`)
      .then(res => {
        const data = res.data;
        console.log('Product data:', data);
        
        setProduct(data);
        setSimilarProducts(Array.isArray(data.similar_products) ? data.similar_products : []);
        // set main image safely
        const initial = getImageUrl(data.image || (data.extra_images && data.extra_images[0]) || '');
        setMainImage(initial || fallbackImageUrl);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch product error:', err);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (!product?.id || !cartCode) return;
    api.get(`check_product_in_cart/?cart_code=${cartCode}&product_id=${product.id}`)
      .then(res => setInCart(res.data.check_product_in_cart))
      .catch(err => console.error('Check cart error:', err));
  }, [cartCode, product]);

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
        api.get(`get_cart_stat?cart_code=${cartCode}`)
          .then(res => {
            if (setNumCartItems) setNumCartItems(res.data.num_of_items);
          })
          .catch(err => console.error('Failed to update cart count:', err));
      })
      .catch(err => {
        console.error('Add to cart failed:', err);
      });
  };

  if (loading) return <ProductPagePlaceHolder />;
  if (!product) return <div className="alert alert-danger">Product not found.</div>;

  const priceDisplay = product.formatted_price || (product.price != null ? Number(product.price).toLocaleString() : '0');

  const extras = Array.isArray(product.extra_images) ? product.extra_images : [];

  return (
    <div>
      <section className="py-3">
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">

            {/* Left: main + thumbnails */}
            <div className="col-md-6">
              <img
                className="card-img-top mb-3 mb-md-0"
                src={mainImage}
                alt={product.name || 'Product'}
                onError={handleImgError}
                style={{ width: '100%', objectFit: 'cover' }}
              />

              <div className="d-flex flex-wrap gap-2 mt-2">
  {/* Main image thumbnail */}
  <img
    key="main-thumb"
    src={getImageUrl(product.image)}
    alt="Main thumbnail"
    onClick={() => setMainImage(getImageUrl(product.image))}
    onError={handleImgError}
    style={{ width: 80, height: 80, objectFit: 'cover', border: '1px solid #ccc', cursor: 'pointer' }}
  />

  {/* Extra images thumbnails */}
  {extras.length > 0 ? (
    extras.map((imgObj, index) => {
      const src = getImageUrl(imgObj.image);  // <-- Use .image here
      return (
        <img
          key={`extra-thumb-${index}`}
          src={src}
          alt={`Extra ${index + 1}`}
          onClick={() => setMainImage(src)}
          onError={handleImgError}
          style={{
            width: 80,
            height: 80,
            objectFit: 'cover',
            borderRadius: 4,
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        />
      );
    })
  ) : (
    <p className="text-muted">No additional images</p>
  )}
</div>
</div>

              {/* Right: details */}
              <div className="col-md-6">
                <div className="small mb-1">SKU: {product.sku || 'N/A'}</div>
                <h1 className="display-5 fw-bolder">{product.name}</h1>
                <div className="fs-5 mb-5">₦{priceDisplay}</div>
                <p className="lead">{product.description || "No description available."}</p>

                <div className="d-flex">
                  <input
                    type="number"
                    min="1"
                    className="form-control text-center me-3"
                    style={{ maxWidth: '3rem' }}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
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