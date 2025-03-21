import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const useFetchFirebase = (collectionName, date) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, collectionName), where("date", "==", date));
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(fetchedData);
      } catch (err) {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(err);
      } 
    };

    fetchData();
  }, [collectionName, date]);

  return { data, error, setData };
};

export default useFetchFirebase;
