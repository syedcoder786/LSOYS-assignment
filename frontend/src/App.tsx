import { Flowbite, useThemeMode } from "flowbite-react";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import AddProduct from "./screens/AddProduct";
import NotFoundPage from "./screens/NotFoundPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "./screens/Profile";

function App() {
  const { setMode } = useThemeMode();
  useEffect(() => {
    setMode("dark");
  }, [setMode]);

  return (
    <Flowbite>
      <ToastContainer />
      <div className="bg-gray-800 ">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* 404 (Not Found) page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </div>
    </Flowbite>
  );
}

export default App;
