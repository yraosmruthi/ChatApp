import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginSignupPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  // For password visibility toggling
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files && files.length > 0) {
      setSignupData((prev) => ({ ...prev, profilePicture: files[0] }));
    } else {
      setSignupData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLoginSubmit = async () => {
   
    try{
      const response = await fetch("http://localhost:3000/api/auth/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",

        },
        credentials:"include",
        body:JSON.stringify(loginData)
      })

      const result = await response.json()
      if(response.ok){
        toast.success("login success")
        navigate("/chat")
        
      } else{
        toast.error("invalid details")
      }


    }catch(error){
       toast.error("server error")
       console.log(error)
    }
    // Add login logic here
  };

  const handleSignupSubmit =async () => {
   try{

   const formData = new FormData()
   formData.append("name",signupData.name)
   formData.append("email", signupData.email);
   formData.append("password", signupData.password);
   formData.append("confirmPassowrd", signupData.confirmPassword);
   if(signupData.profilePicture){
    formData.append("pic", signupData.profilePicture);
   }

   const response = await fetch("http://localhost:3000/api/auth/register",{
    method:"POST",
    body:formData
   })
   const result = await response.json()                         
   if(response.ok){
    toast.sucess("Sign up success,now Login");
   }else{
    toast.error("invalid details")
   }
  }catch(error){
    toast.error("server error")
    console.log(error)

  }
    // Add signup logic here
  };

  const handleGuestLogin = () => {
    setLoginData({email:"guest@example.com",password:"1234"})
    console.log("Guest login requested");
    // Add guest login logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-6 rounded-lg bg-gray-900 shadow-xl">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Talk-A-Tive
        </h1>

        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "login"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300"
            } rounded-l-lg transition-colors`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              activeTab === "signup"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300"
            } rounded-r-lg transition-colors`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {activeTab === "login" ? (
          <div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="Enter Your Email Address"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Enter Password"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                >
                  {showLoginPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              onClick={handleLoginSubmit}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mb-3"
            >
              Login
            </button>

            <button
              onClick={handleGuestLogin}
              className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Get Guest User Credentials
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={signupData.name}
                onChange={handleSignupChange}
                placeholder="Enter Your Name"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                placeholder="Enter Your Email Address"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  placeholder="Enter Password"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                >
                  {showSignupPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">
                Upload your Picture
              </label>
              <input
                type="file"
                name="profilePicture"
                onChange={handleSignupChange}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-md  border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleSignupSubmit}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
