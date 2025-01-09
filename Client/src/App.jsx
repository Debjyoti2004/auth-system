import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import EmailVerify from "./pages/EmailVerify"
import ResetPassword from "./pages/ResetPassword"
import { ToastContainer } from 'react-toastify';


export default function App() {
  return (
    <div >
      <BrowserRouter>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/email-verify" element={<EmailVerify/>}></Route>
        <Route path="/reset_password" element={<ResetPassword/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}