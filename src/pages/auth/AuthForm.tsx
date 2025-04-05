import { useState } from "react";
import { toast } from "react-toastify";
import InputField from "@/components/InputFieldWithFloatingLabel";
import PasswordField from "@components/PasswordField";
import google from "@assets/images/google.png";
import Modal from "@components/Modal";
import ForgotPassword from "@pages/auth/ForgotPassword";
import { useAuth } from "@context/AuthContext";
import PrimaryButton from "@/components/PrimaryButton";

interface AuthFormProps {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, setIsLogin }) => {
  const [loginData, setLoginData] = useState({
    email: "admin@gmail.com",
    password: "Admin@123",
  });
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { signInWithGoogle, signUpWithEmail, signInWithEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      if (!loginData.email || !loginData.password) {
        toast.error("Please fill in all fields.");
        return;
      }

      try {
        await signInWithEmail(loginData.email, loginData.password);
      } catch (error: any) {
        toast.error(error.message || "Sign-in failed.");
      }
    } else {
      if (!signupData.fullName || !signupData.email || !signupData.password) {
        toast.error("Please fill in all fields.");
        return;
      }

      try {
        await signUpWithEmail(
          signupData.fullName,
          signupData.email,
          signupData.password
        );
      } catch (error: any) {
        toast.error(error.message || "Signup failed.");
      }
    }
  };

  const signInWithGoogleHandler = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.log(error);

      toast.error(error.message || "Google Sign-In failed.");
    }
  };

  return (
    <>
      <form className="space-y-6 w-full max-w-sm" onSubmit={handleSubmit}>
        {!isLogin && (
          <InputField
            id="fullName"
            type="text"
            placeholder="Full Name"
            value={signupData.fullName}
            onChange={(e) =>
              setSignupData({ ...signupData, fullName: e.target.value })
            }
          />
        )}

        <InputField
          id="email"
          type="email"
          placeholder="Email"
          value={isLogin ? loginData.email : signupData.email}
          onChange={(e) =>
            isLogin
              ? setLoginData({ ...loginData, email: e.target.value })
              : setSignupData({ ...signupData, email: e.target.value })
          }
        />

        <PasswordField
          id="password"
          placeholder="Password"
          value={isLogin ? loginData.password : signupData.password}
          showPassword={isLogin ? showLoginPassword : showSignupPassword}
          setShowPassword={
            isLogin ? setShowLoginPassword : setShowSignupPassword
          }
          onChange={(e) =>
            isLogin
              ? setLoginData({ ...loginData, password: e.target.value })
              : setSignupData({ ...signupData, password: e.target.value })
          }
        />

        {isLogin && (
          <div className="flex justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" />
              <span>Remember Me</span>
            </label>
            <div
              className="text-primary hover:underline cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              Forgot Password?
            </div>
          </div>
        )}

        <PrimaryButton type="submit" className="mt-4">
          {isLogin ? "Login" : "Signup"}
        </PrimaryButton>

        <p className="text-center w-full"> OR </p>

        <button
          type="button"
          onClick={signInWithGoogleHandler}
          className="mt-4 w-full flex items-center justify-center space-x-3 p-3 rounded-lg bg-secondary text-theme shadow-md hover:shadow-lg transition"
        >
          <img src={google} alt="Google" className="w-5 h-5" />
          <span className="font-medium">
            {isLogin ? "Sign in with Google" : "Sign up with Google"}
          </span>
        </button>

        {isLogin ? (
          <p className="mt-4 text-sm text-center">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className="text-primary hover:underline"
            >
              Sign up now!
            </button>
          </p>
        ) : (
          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className="text-primary hover:underline"
            >
              Login here!
            </button>
          </p>
        )}
      </form>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ForgotPassword onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
};

export default AuthForm;
