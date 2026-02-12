import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { currency } from "../../utils/filter";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`);
        setProducts(res.data.products);
        // console.log(res.data.products);
      } catch (error) {
        console.log(error.response);
      }
    };
    getProducts();
  }, []);
  // 下面為方法一 使用 navigate 傳遞 state 給單一產品頁面
  // const handleView = async (id) => {
  //   try {
  //     const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
  //     console.log(res.data.product);
  //     navigate(`/product/${id}`, {
  //       state: {
  //         productData: res.data.product,
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error.response);
  //   }
  // };

  //下面為方法二 使用 useParams 將 id 透過 navigate 倒入下一分頁 重新打 API 取得資料
  const handleView = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <>
      <div className="container">
        <div className="row justidy-content-center">
          {products.map((product) => (
            <div className="col-md-4  col-6 mb-3 " key={product.id}>
              <div className="card ">
                <img
                  src={product.imageUrl}
                  className="card-img-top"
                  alt={product.title}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {product.category} {product.title}{" "}
                    <span className="badge rounded-pill text-bg-danger ms-2">
                      {product.style}
                    </span>
                  </h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">
                    <del>原價：{currency(product.origin_price)}</del> 售價：
                    {currency(product.price)}
                    <small className="text-body-secondary">
                      /{product.unit}
                    </small>
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleView(product.id)}
                  >
                    查看更多
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Products;
