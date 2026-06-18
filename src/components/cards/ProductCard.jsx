import React from "react";
import { div } from "three/src/nodes/math/OperatorNode.js";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      {product.imgUrl && (
        <img
          src={product.imgUrl}
          alt={product.name}
          className="product-image"
        />
      )}

      <div className="product-content">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.descrption}</p>

        {product.modelUrl && (
          <button className="view-3d-btn">3D Görüntüle</button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
