import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const auth = getAuth(); // Initialize Firebase Authentication

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { // Listen for authentication state changes
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return { user, logout };
};
