import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomeCard.module.css';
import { BASE_URL } from '../../api';

const HomeCard = ({ product }) => {
  if (!product) return null; // Prevents crash if undefined

  return (
    <div className={`col-md-3 ${styles.col}`}>
      <Link to={`/products/${product.slug}`} className={styles.link}>
        <div className={styles.card}>
          <div className={styles.cardImgWrapper}>
            <img
              src={
                product.image && product.image.startsWith('http')
                  ? product.image
                  : `${BASE_URL}${product.image}`
              }
              className={styles.cardImgTop}
              alt={product.name}
              onError={(e) => {
                console.log('Image failed to load:', product.image);
                e.target.src = '/images/default.jpg'; // fallback image
              }}
            />
          </div>
          <div className={styles.cardBody}>
            <h5 className={`${styles.cardTitle} mb-1`}>{product.name}</h5>
            <h6 className={styles.cardText}>₦{product.formatted_price}</h6>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default HomeCard;
