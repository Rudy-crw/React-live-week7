import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { currency } from "../../utils/filter";
import { get, useForm } from "react-hook-form";
import { RotatingLines } from "react-loader-spinner";
import * as bootstrap from "bootstrap";
import SingleProductModal from "../../components/SingleProductModal";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

// SweetAlert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { emailValidation } from "../../utils/validation";

// SweetAlert
const MySwal = withReactContent(Swal);
// 2. 自定義一個 Toast (右上角小提示)
// 這樣之後呼叫只要寫 Toast.fire(...) 即可，不用重複寫設定
const Toast = MySwal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  // didOpen: (toast) => {
  //   toast.onmouseenter = Swal.stopTimer;
  //   toast.onmouseleave = Swal.resumeTimer;
  // },
});

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [product, setProduct] = useState({});
  //可改為老師上課時使用的 list 的方式
  const [loadingCardId, setLoadingCardId] = useState(null);
  const [loadingProductId, setLoadingProductId] = useState(null);

  const productModalRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  });
  const getCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res.data.data);
      // console.log("res.data.data:", res.data);
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`);
        setProducts(res.data.products);
        console.log(res.data.products);
      } catch (error) {
        console.log(error.response);
      }
    };
    getProducts();
    getCart();
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });
    // Modal 關閉時移除焦點
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });
  }, []);

  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const data = {
        product_id: productId,
        qty,
      };
      // eslint-disable-next-line no-unused-vars
      const res = await axios.put(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
        { data },
      );
      Toast.fire({ icon: "success", title: "數量已更新" });
      // console.log(res);
      getCart();
      // const res2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      // setCart(res2.data.data);
      // Toast.fire({
      //   icon: "success",
      //   title: "商品數量已成功更新",
      // });
    } catch (error) {
      console.log(error.response);
    }
  };
  const addCart = async (id, qty) => {
    setLoadingCardId(id);
    try {
      const data = {
        product_id: id,
        qty,
      };
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data,
      });
      // console.log(res.data);
      Toast.fire({
        icon: "success",
        title: "商品已加入購物車",
      });
      // const res2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      // setCart(res2.data.data);
      getCart();
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoadingCardId(null);
    }
  };

  const delCart = async (cartId) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const res = await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
      );
      // console.log(res);
      // const res2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      // setCart(res2.data.data);
      Toast.fire({
        icon: "success",
        title: "商品刪除成功！",
      });
      getCart();
    } catch (error) {
      console.log(error.response);
    }
  };

  const delAllCart = async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const res = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      // console.log(res);
      // const res2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      // setCart(res2.data.data);
      getCart();
    } catch (error) {
      console.log(error.response);
    }
  };

  const onSubmit = async (formData) => {
    // console.log(formData);
    try {
      const data = {
        user: formData,
        message: formData.message,
      };
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
        data,
      });
      reset();
      // console.log(res.data);
      //送出成功後，購物車會刷新
      // const res2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      // setCart(res2.data.data);
      getCart();
      MySwal.fire({
        icon: "success",
        title: "訂單建立成功",
        html: `您的訂單編號為：<br><b>${res.data.orderId}</b>`,
        confirmButtonText: "確定",
      });
    } catch (error) {
      console.log(error.response);
      Toast.fire({
        icon: "error",
        title: "訂單建立失敗",
        text: error.response?.data?.message || "發生未知錯誤",
      });
    }
  };
  const handleView = async (id) => {
    setLoadingProductId(id);
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoadingProductId(null);
    }
    productModalRef.current.show();
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };
  return (
    // src/views/front/Cart.jsx
    <div className="container">
      {/* 產品列表 */}
      <table className="table align-middle">
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: "200px" }}>
                <div
                  style={{
                    height: "100px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${product.imageUrl})`,
                  }}
                ></div>
              </td>
              <td>
                {product.category} {product.title}
              </td>
              <td>
                <del className="h6">原價：{product.origin_price}</del>
                <div className="h5">特價：{product.price}</div>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      handleView(product.id);
                    }}
                    disabled={loadingProductId === product.id}
                  >
                    {loadingProductId === product.id ? (
                      <RotatingLines color="grey" width={80} height={16} />
                    ) : (
                      "查看更多"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => {
                      addCart(product.id, 1);
                    }}
                    disabled={loadingCardId === product.id}
                  >
                    {loadingCardId === product.id ? (
                      <RotatingLines color="grey" width={80} height={16} />
                    ) : (
                      "加到購物車"
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>購物車列表</h2>
      <div className="text-end mt-4">
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => {
            delAllCart();
          }}
          disabled={!cart.carts?.length}
        >
          清空購物車
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">品名</th>
            <th scope="col">數量/單位</th>
            <th className="text-end" scope="col">
              小計
            </th>
          </tr>
        </thead>
        <tbody>
          {cart?.carts?.map((cartItem) => (
            <tr key={cartItem.id}>
              <td>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    delCart(cartItem.id);
                  }}
                >
                  刪除
                </button>
              </td>
              <td>
                <img
                  src={cartItem.product.imageUrl}
                  alt={cartItem.product.title}
                  style={{ width: 100 }}
                />
              </td>
              <th scope="row">
                {cartItem.product.category} {cartItem.product.title}
              </th>

              <td>
                {cartItem.product.qty}

                <div className="input-group input-group-sm mb-3">
                  <input
                    type="number"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-sm"
                    defaultValue={cartItem.qty}
                    onChange={(e) => {
                      updateCart(
                        cartItem.id,
                        cartItem.product_id,
                        Number(e.target.value),
                      );
                    }}
                  />
                  <span className="input-group-text" id="inputGroup-sizing-sm">
                    {cartItem.product.unit}
                  </span>
                </div>
              </td>
              <td className="text-end">{currency(cartItem.final_total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="text-end" colSpan="4">
              總計
            </td>
            <td className="text-end">{currency(cart.final_total)}</td>
          </tr>
        </tfoot>
      </table>
      {/* 結帳頁面 */}
      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="請輸入 Email"
              {...register("email", emailValidation)}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="請輸入姓名"
              {...register("name", {
                required: "請輸入姓名",
                minLength: {
                  value: 2,
                  message: "姓名最少 2 個字",
                },
              })}
            />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              name="tel"
              type="tel"
              className="form-control"
              placeholder="請輸入電話"
              {...register("tel", {
                required: "請輸入電話",
                pattern: {
                  value: /^\d+$/,
                },
                minLength: {
                  value: 8,
                  message: "電話至少 8 碼",
                },
              })}
            />
            {errors.tel && <p className="text-danger">{errors.tel.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              name="address"
              type="text"
              className="form-control"
              placeholder="請輸入地址"
              {...register("address", {
                required: "請輸入地址",
              })}
            />
            {errors.address && (
              <p className="text-danger">{errors.address.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register("message")}
            ></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-danger">
              送出訂單
            </button>
          </div>
        </form>
      </div>

      <SingleProductModal
        product={product}
        addCart={addCart}
        closeModal={closeModal}
      />
    </div>
  );
};

export default Checkout;
