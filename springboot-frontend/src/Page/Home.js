import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import "./Home.css"; // 👈 add css file

export default function Home({ selectedCategory }) {
  const [product, setProduct] = useState([]);
  const [isError, setIsError] = useState(false);
  const [imageUrls, setImageUrls] = useState({});

  const { addToCart } = useContext(AppContext);

  // ✅ Fetch products whenever category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "http://localhost:8080/product/search";

        if (selectedCategory) {
          url += `?category=${selectedCategory}`;
        }

        const res = await axios.get(url);
        const products = res.data;
        setProduct(products);

        // ✅ Fetch images
        const imageMap = {};
        await Promise.all(
          products.map(async (p) => {
            try {
              const imgRes = await axios.get(
                `http://localhost:8080/product/${p.id}/image`,
                { responseType: "blob" }
              );
              imageMap[p.id] = URL.createObjectURL(imgRes.data);
            } catch {
              imageMap[p.id] = null;
            }
          })
        );

        setImageUrls(imageMap);
      } catch (err) {
        console.error("Error fetching products:", err);
        setIsError(true);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  if (isError) {
    return <h2 className="center">Failed to load products</h2>;
  }

  return (
    <div className="products-container">
      {product.length === 0 ? (
        <h2 className="center">No Products Available</h2>
      ) : (
        product.map((p) => {
          const { id, brand, name, price, available } = p;
          const imageUrl = imageUrls[id];

          return (
            <div className="product-card" key={id}>
              <Link
                to={`/productById/${id}`}
                className="product-link"
              >
                <img
                  src={imageUrl || "/placeholder.jpg"}
                  alt={name}
                  className="product-image"
                />

                <div className="product-body">
                  <div>
                    <h5 className="product-title">{name.toUpperCase()}</h5>
                    <i className="product-brand">~ {brand}</i>
                  </div>

                  <div>
                    <h5 className="product-price">₹ {price}</h5>

                    <button
                      className="cart-btn"
                      disabled={!available}
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(p);
                      }}
                    >
                      {available ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          );
        })
      )}
    </div>
  );
}