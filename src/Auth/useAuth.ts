import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";

// Define a type for the hook return value
interface UseAuthResult {
  user: User | null;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthResult => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(); // Initialize Firebase Authentication

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Clean up subscription on component unmount
    return () => unsubscribe();
  }, [auth]);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Failed to log out:", error);
      // Optionally, handle the error or display a notification
    }
  };

  return { user, logout };
};
