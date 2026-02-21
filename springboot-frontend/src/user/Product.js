import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AppContext from '../Context/Context';
import { Button } from 'bootstrap/dist/js/bootstrap.bundle.min';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const { data, addToCart, removeFromCart, cart, refreshData } = useContext(AppContext);
  const navigate = useNavigate();

  // Fetch product details and image
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/product/${id}`);
        setProduct(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching product", error);
      }
    };  

    const fetchImage = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/product/${id}/image`, {
          responseType:"blob"
        });
        setImageUrl(URL.createObjectURL(res.data));
      } catch (error) {
        console.error("Error fetching image", error);
      }
    };
    fetchProduct();
    fetchImage();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }


  // Handle Add to Cart
  const handleAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8080/product/${id}`);
      removeFromCart(id);
      console.log("Product deleted successfully");
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };


  const handleEditClick = () => {
    navigate(`/product/updateProduct/${id}`);
  };

  return (
    <div
      className="outer-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        margin: "0",
      }}
    >
      <div
        className="containers"
        style={{
          display: "flex", // Use flexbox to arrange items in a row
          width: "80%", // Make it responsive
          maxWidth: "900px", // Limit maximum width
          borderRadius: "10px",
          margin: "10px",
          overflow: "hidden",
        }}
      >
        {/* Left Column for Image */}
        <div style={{ flex: 1, padding: "10px" }}>
          <img
            className="left-column-img"
            src={imageUrl}
            alt={product.imageName || "Product image"}
            onError={(e) => (e.target.src = 'default-image.jpg')} // Placeholder image on error
            style={{
              width: "100%", // Make the image responsive
              height: "560px", 
              objectFit: "contain",
            }}
          />
        </div>

        {/* Right Column for Product Details */}
        <div style={{ flex: 1, padding: "20px" }}>
          <div className="product-description">
            <span>{product.category}</span>
            <h1>{product.name}</h1>
            <hr/>
            <h5>{product.brand}</h5>
            <p>{product.description}</p>
          </div>

          <div className="product-price mb-2">
            <span className="mx-4">
              <b>{"₹" + product.price}</b>
            </span>
            </div>
            <div className='mb-3'>
              <button
                className={`cart-btn ${!product.available ? "disabled-btn" : ""} btn-dark btn-sm btn rounded-pill`}
                disabled={!product.available}
                onClick={handleAddToCart}
              >
                {product.available ? "Add to cart" : "Out of Stock"}
              </button>
            </div>
            <div className='mb-2'>
            <h6>
              Stock Available:{" "}
              <i style={{ color: "green", fontWeight: "bold" }}>
                {product.quantity}
              </i>
            </h6>
            </div>
            <div>
            <p className="release-date">
              <h6>Product listed on:</h6>
              <i>{product.releaseDate}</i>
            </p>
          </div>

          {/* Update and Delete buttons */}
          <div className="update-button">
            <button className="btn btn-success btn-sm mx-3" type="button"
            onClick={handleEditClick}>
              Update
            </button>
            <button className="btn btn-danger btn-sm" type="button"
            onClick={deleteProduct}>
              Delete
            </button>
            <hr/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
