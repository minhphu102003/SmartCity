import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/authProvider";
import MethodContext from "../../context/methodProvider";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link ,useNavigate } from "react-router-dom";
import * as userServices from '../../services/user';
import * as authServices from '../../services/auth';
import icons from '../../utils/icon';

const Header = () => {
  const { auth } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [isLogin,setIsLogin] = useState(false);
  const navigate = useNavigate();
  const {notify} = useContext(MethodContext);

  useEffect(()=>{
    const fetchingCurrentUser = async() =>{
      const accessToken = auth.accessToken || 
      JSON.parse(localStorage.getItem("accessToken")).accessToken;
      const responseUser = await userServices.getCurrentUser(accessToken);
      console.log(responseUser);
      if(responseUser?.status === 200){
        const userData = responseUser?.data;
        console.log(userData);
        setUser(userData);
        const newAuth = {...auth, userData};
        localStorage.setItem("auth",JSON.stringify(newAuth));
        setIsLogin(true);
      }
      else{
        localStorage.removeItem("access-token");
      }
    };
    console.log(localStorage.getItem("access-token"));
    localStorage.getItem("access-token") !== null && fetchingCurrentUser(); 
  },[]);


  const handleLogout = async () => {
    const fetchingLogOut = await authServices.logout();
    if(fetchingLogOut?.status === 200){
      localStorage.removeItem("auth");
      localStorage.removeItem("access-token");
      localStorage.removeItem("refresh-token");
      navigate("/login",{
        state:{
          toastMessage: "Đăng xuất thành công!",
          statusMessage:"success",
        }
      });
    }else{
      console.log(fetchingLogOut?.response);
      notify("Đăng xuất thất bại! ","error");
    }
  };

  return (
    <header className=" ml-20 w-[calc(100%-5rem)] absolute top-0 left-0 w-full p-4 bg-transparent z-50 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center bg-gray-100 p-2 rounded-full shadow-md w-[300px]">
          <input
            type="text"
            placeholder="Tìm kiếm trên Smart City"
            className="bg-gray-100 outline-none pl-2 flex-grow"
          />
          <button className="ml-auto mr-5 text-gray-600">
            <icons.HiOutlineSearch size={24} />
          </button>
        </div>
        <div className="flex space-x-4 ml-4">
      <button className="bg-gray-100 p-2 rounded-full shadow-md flex items-center">
        <icons.HiOutlineEmojiHappy size={20} className="text-gray-400" />
        <span className="ml-2 text-sm">Nhà hàng</span>
      </button>
      <button className="bg-gray-100 p-2 rounded-full shadow-md flex items-center">
        <icons.HiOutlineHome size={20} className="text-gray-400" />
        <span className="ml-2 text-sm">Khách sạn</span>
      </button>
      <button className="bg-gray-100 p-2 rounded-full shadow-md flex items-center">
        <icons.HiOutlineCamera size={20} className="text-gray-400" />
        <span className="ml-2 text-sm">Điểm tham quan</span>
      </button>
      <button className="bg-gray-100 p-2 rounded-full shadow-md flex items-center">
        <icons.HiOutlineOfficeBuilding size={20} className="text-gray-400" />
        <span className="ml-2 text-sm">Bảo tàng</span>
      </button>
        </div>
      </div>
      <div>
        {isLogin ? (
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/32" // Replace with user's avatar URL
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white p-2 rounded-full shadow-md"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <button
          >
            <Link
                  to="/login"
                  className="mr-2 rounded-lg px-4 py-2 text-sm font-bold bg-gray-100 mr-10 text-gray-800 transition-all hover:bg-gray-300 hover:text-primaryColor lg:px-5 lg:py-2.5 "
                >
                  Đăng Nhập
                </Link>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
