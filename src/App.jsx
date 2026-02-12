import { RouterProvider } from "react-router";
import { router } from "./router";
import "./assets/style.css";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
