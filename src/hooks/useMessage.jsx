// 把 message 的內容封裝起來，就不需要每次都打一長串 slice 需要的內容
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../slice/messageSlice";
const useMessage = () => {
  const dispatch = useDispatch();

  const showSuccess = (message) => {
    dispatch(
      createAsyncMessage({
        success: true,
        message,
      }),
    );
  };

  const showError = (message) => {
    dispatch(
      createAsyncMessage({
        success: false,
        message,
      }),
    );
  };

  return {
    showError,
    showSuccess,
  };
};

export default useMessage;
