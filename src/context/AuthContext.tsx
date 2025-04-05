import { createContext, useContext, useState, ReactNode } from "react";
import { auth, db } from "@config/FirebaseConfig"; // Ensure that Firebase is initialized here
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// User Type Definition
interface User {
  uid: string;
  name: string;
  email: string;
  role: "admin" | "user"; // You can customize the role as needed
  created_at: Date;
  status: boolean;
}

// AuthContext Type Definition
interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>; // ✅ Forgot Password Function added
}

// Creating the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      const userData: User = {
        uid: user.uid,
        name: user.displayName || "User",
        email: user.email || "",
        role: "user", // Default role
        created_at: new Date(),
        status: true,
      };

      if (!userSnap.exists()) {
        await setDoc(userRef, userData); // Create user if not found
      } else {
        userData.role = userSnap.data().role || "user"; // Set role from Firestore
      }

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success(`Welcome, ${userData.name}!`);
      navigate("/dashboard");
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        console.log("User closed the sign-in popup.");
      } else {
        const errorMessage = error?.message || "Google Sign-In failed.";
        toast.error(`Error: ${errorMessage}`);
      }
    }
  };

  // Sign Up with Email and Password
  const signUpWithEmail = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    try {
      const result: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;

      const userData: User = {
        uid: user.uid,
        name: fullName,
        email: user.email || "",
        role: "user", // Default role is "user"
        created_at: new Date(),
        status: true,
      };

      // Save the user data in Firestore
      await setDoc(doc(db, "users", user.uid), userData);
      setUser(userData); // Set user in Context
      localStorage.setItem("user", JSON.stringify(userData)); // Store user in localStorage
      toast.success("Signup successful!");
      navigate("/dashboard");
    } catch (error: any) {
      const map: Record<string, string> = {
        "auth/email-already-in-use": "Email already registered.",
        "auth/invalid-email": "Invalid email.",
        "auth/weak-password": "Weak password.",
      };

      toast.error(map[error.code] || "Signup failed.");
    }
  };

  // Sign In with Email and Password
  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;

      // Check if the user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      const userData: User = {
        uid: user.uid,
        name: userSnap.data()?.name || "User",
        email: user.email || "",
        role: userSnap.data()?.role || "user",
        created_at: userSnap.data()?.created_at || new Date(),
        status: userSnap.data()?.status || true,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData)); // Store user in localStorage
      toast.success(`Welcome back, ${userData.name}!`);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Sign-in failed.");
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/");
  };

  // ✅ Forgot Password Function
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset link sent! Check your email.");
    } catch (error: any) {
      toast.error(error.message || "Error resetting password.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
