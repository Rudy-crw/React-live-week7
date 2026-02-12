import { RouterProvider } from "react-router";
import { router } from "./router";
import "./assets/style.css";
import MessageToast from "./components/MessageToast";

const App = () => {
  return (
    <>
      <MessageToast />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
