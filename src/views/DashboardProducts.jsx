import { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import "../assets/style.css";
import ProductModal from "../components/ProductModal";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router";
import { TailSpin } from "react-loader-spinner";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
  style: "",
  //, 新增API 沒有的屬性
};

function DashboardProducts() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  // const [isAuth, setIsAuth] = useState(() => {
  //   const token = document.cookie
  //     .split("; ")
  //     .find((row) => row.startsWith("hexToken="))
  //     ?.split("=")[1];
  //   if (token) {
  //     axios.defaults.headers.common["Authorization"] = token;
  //     return true;
  //   }
  //   return false;
  // });
  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState();
  const [pagination, setPagination] = useState({});
  const productModalRef = useRef(null);
  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(Object.values(res.data.products));
      // console.log(Object.values(res.data.products));
      setPagination(res.data.pagination);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
    if (!token) {
      navigate("/login");
      return;
    }
    axios.defaults.headers.common["Authorization"] = token;
    const checkLogin = async () => {
      try {
        const res = await axios.post(`${API_BASE}/api/user/check`);
        console.log("token 驗證結果:", res.data);
        setIsAuth(true);
        getProducts();
      } catch (error) {
        console.error("token 驗證失敗", error.response);
      }
    };
    checkLogin();
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
  }, [navigate]);

  const openModal = (type, product) => {
    // console.log(product);
    setModalType(type);
    setTemplateProduct({ ...INITIAL_TEMPLATE_DATA, ...product });
    productModalRef.current.show();
  };
  const closeModal = () => {
    productModalRef.current.hide();
  };

  return (
    <>
      {isAuth ? (
        <div className="container">
          <h2>產品列表</h2>
          <div className="text-end mt-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
            >
              建立新的產品
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>品牌</th>
                <th>車型風格</th>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>編輯</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((item) => (
                  <tr key={item.id}>
                    <td>{item.category}</td>
                    <td>{item.style}</td>
                    <th scope="row">{item.title}</th>
                    <td>{item.origin_price}</td>
                    <td>{item.price}</td>
                    <td className={`${item.is_enabled && "text-success"}`}>
                      {item.is_enabled ? "啟用" : "未啟用"}
                    </td>
                    <td>
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Basic product"
                      >
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => openModal("edit", item)}
                        >
                          編輯
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => openModal("delete", item)}
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    尚無產品資料
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination pagination={pagination} onChangePage={getProducts} />
        </div>
      ) : (
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
        >
          {/* 使用 TailSpin */}
          <TailSpin
            height="80"
            width="80"
            color="#0d6efd" // Bootstrap Primary Blue
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />

          <p className="mt-3 text-secondary fw-bold">系統驗證中，請稍候...</p>
        </div>
      )}

      <ProductModal
        modalType={modalType}
        templateProduct={templateProduct}
        closeModal={closeModal}
        getProducts={getProducts}
      />
    </>
  );
}

export default DashboardProducts;
