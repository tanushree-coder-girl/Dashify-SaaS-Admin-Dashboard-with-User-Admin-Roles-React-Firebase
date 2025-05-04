import { useState } from "react";
import { useForm } from "react-hook-form";
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

type AuthFormValues = {
  name?: string;
  email: string;
  password: string;
};

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, setIsLogin }) => {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signInWithGoogle, signUpWithEmail, signInWithEmail } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<AuthFormValues>({
    defaultValues: isLogin
      ? { email: "", password: "" }
      : { name: "", email: "", password: "" },
  });

  const values = watch();

  const onSubmit = async (data: AuthFormValues) => {
    setIsSubmitting(true);
    try {
      if (isLogin) {
        const { email, password } = data as AuthFormValues;
        if (!email || !password) {
          toast.error("Please fill in all fields.");
          return;
        }
        await signInWithEmail(email, password);
      } else {
        const { name, email, password } = data as AuthFormValues;
        if (!name || !email || !password) {
          toast.error("Please fill in all fields.");
          return;
        }
        await signUpWithEmail(name, email, password);
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const signInWithGoogleHandler = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast.error(error.message || "Google Sign-In failed.");
    }
  };

  // handle switching between login/signup and reset fields
  const handleSwitch = (toLogin: boolean) => {
    setIsLogin(toLogin);
    reset(
      toLogin
        ? { email: "", password: "" }
        : { name: "", email: "", password: "" }
    );
  };

  return (
    <>
      <form
        className="space-y-6 w-full max-w-sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        {!isLogin && (
          <InputField
            id="name"
            type="text"
            placeholder="Full Name"
            error={errors?.name?.message}
            value={values?.name || ""}
            {...register("name")}
          />
        )}

        <InputField
          id="email"
          type="email"
          placeholder="Email"
          error={errors.email?.message}
          value={values.email || ""}
          {...register("email")}
        />

        <PasswordField
          id="password"
          placeholder="Password"
          value={values.password || ""}
          error={errors.password?.message}
          showPassword={isLogin ? showLoginPassword : showSignupPassword}
          setShowPassword={
            isLogin ? setShowLoginPassword : setShowSignupPassword
          }
          {...register("password")}
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

        <PrimaryButton type="submit" className="mt-4" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-3">
              <span className="loader inline-block w-5 h-5 border-2 text-theme rounded-full animate-spin" />
              <span className="text-theme">Loading..</span>
            </div>
          ) : isLogin ? (
            "Login"
          ) : (
            "Signup"
          )}
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
              onClick={() => handleSwitch(false)}
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
              onClick={() => handleSwitch(true)}
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
