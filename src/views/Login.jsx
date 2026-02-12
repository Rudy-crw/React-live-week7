import axios from "axios";
import { useForm } from "react-hook-form";
import { emailValidation } from "../utils/validation";
import { useNavigate } from "react-router";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

// SweetAlert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// SweetAlert
const MySwal = withReactContent(Swal);
// 2. 自定義一個 Toast (右上角小提示)
// 這樣之後呼叫只要寫 Toast.fire(...) 即可，不用重複寫設定
const Toast = MySwal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

function Login() {
  // function Login({ getProducts, setIsAuth }) {
  // const [formData, setFormData] = useState({
  //   username: "",
  //   password: "",
  // });
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "s60990340@gmail.com",
      password: "",
    },
  });
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const onSubmit = async (formData) => {
    try {
      // e.preventDefault();
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      console.log(res.data);
      const { token, expired } = res.data;
      // eslint-disable-next-line
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
      // eslint-disable-next-line
      axios.defaults.headers.common["Authorization"] = token;
      Toast.fire({
        icon: "success",
        title: "登入成功",
      });

      navigate("/dashboardproducts");
    } catch (e) {
      Toast.fire({
        icon: "error",
        title: "登入失敗，請檢查帳號密碼！",
      });
      console.log(e.response);
    }
  };

  return (
    <div className="container login">
      <div className="row justify-content-center">
        <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
        <div className="col-8">
          <form
            id="form"
            className="form-signin"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                name="username"
                placeholder="name@product.com"
                // value={formData.username}
                // onChange={handleInputChange}
                required
                autoFocus
                {...register("username", emailValidation)}
              />
              <label htmlFor="username">Email address</label>
              {errors.username && (
                <p className="text-danger">{errors.username.message}</p>
              )}
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                // value={formData.password}
                // onChange={handleInputChange}
                required
                {...register("password", {
                  required: "請輸入密碼",
                  minLength: {
                    value: 6,
                    message: "密碼最少 6 碼",
                  },
                })}
              />
              <label htmlFor="password">Password</label>
              {errors.password && (
                <p className="text-danger">{errors.password.message}</p>
              )}
            </div>
            <button
              className="btn btn-lg btn-primary w-100 mt-3"
              type="submit"
              disabled={!isValid}
            >
              登入
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
