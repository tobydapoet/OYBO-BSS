import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import DiscountPage from "./pages/DiscountPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/PorfilePage";
import MainLayout from "./Layout/MainLayout";
import RegisterPage from "./pages/RegisterPage";
import ProductPage from "./pages/ProductPage";
import Cartpage from "./pages/CartPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/account" element={<LoginPage />} />
          <Route path="/collections/:label" element={<CollectionPage />} />
          <Route path="/discount" element={<DiscountPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/products/:handle" element={<ProductPage />} />
          <Route path="/cart" element={<Cartpage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
