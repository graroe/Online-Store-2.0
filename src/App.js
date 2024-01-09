import { Routes, Route, Outlet } from "react-router-dom";
import { Navigationbar } from "./components/navigationbar";
import { Register } from "./pages/register";
import { Login } from "./pages/login";
import { Shop } from "./pages/shop/shop";
import { Contact } from "./pages/contact";
import { About } from "./pages/about";
import { Account } from "./pages/account";
import { Reviews } from "./pages/reviews";
import { Services } from "./pages/services";
import { Cart } from "./pages/shop/cart";
import { Confirmed } from "./pages/checkout/confirmed";
import { Shipping } from "./pages/checkout/shipping";
import { Payment } from "./pages/checkout/payment";
import { Select } from "./pages/manage-db/select";
import { Insert } from "./pages/manage-db/insert";
import { Update } from "./pages/manage-db/update";
import { Delete } from "./pages/manage-db/delete";
import { Footer } from "./components/footer";

function App() {

  return (
    <div className="App">
      <Routes>
        <Route element={<Layout />} >
          <Route path="/shop" element={<Shop />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
          <Route path="/confirmed" element={<Confirmed />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/manage/select" element={<Select />} />
          <Route path="/manage/insert" element={<Insert />} />
          <Route path="/manage/update" element={<Update />} />
          <Route path="/manage/delete" element={<Delete />} />
        </Route>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

    </div>
  );
}

function Layout() {
  return (
    <main>
      <Navigationbar />
      <Outlet />
      <Footer />
    </main>
  )
}

export default App;
