import jwt_decode from "jwt-decode";
import { useState, useEffect } from "react";
const useSession = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    if (token) {
      const decoded: any = jwt_decode(token);
      const now = Date.now() / 1000;

      if (decoded.exp > now) setSession(decoded);
    }
    setLoading(false);
  }, []);

  return { session, loading };
};

export default useSession;
