import { createContext, useEffect, useState } from "react";
import { dbObject } from "../helper/constant";
import { auth } from "../firebase.config";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await dbObject.get("/users/auth.php");
      if (!data.error) {
        setUser(data.response);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    getData();
  }, []);
  return (
    <AppContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
