import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastMessage = () => {
  return (
    <div>
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default ToastMessage;
