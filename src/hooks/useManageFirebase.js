import { addDoc, deleteDoc, updateDoc, doc, collection } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const useManageFirestore = (collectionName, setData) => {
    const addItem = async (newItem) => {
      try {
        const docRef = await addDoc(collection(db, collectionName), newItem);
        setData(prevData => [...prevData, { id: docRef.id, ...newItem }]);
      } catch (error) {
        console.error(` ${collectionName}의 추가 error 발생`, error);
      }
    };
  
    const deleteItem = async (id) => {
      try {
        await deleteDoc(doc(db, collectionName, id));
        setData(prevData => prevData.filter(item => item.id !== id));
      } catch (error) {
        console.error(`${collectionName}의 삭제 error 발생생:`, error);
      }
    };
  
    const updateItem = async (id, updatedFields) => {
      try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, updatedFields);
        setData(prevData =>
          prevData.map(item => (item.id === id ? { ...item, ...updatedFields } : item))
        );
      } catch (error) {
        console.error(`${collectionName}의 업데이트 error 발생`, error);
      }
    };
  
    return { addItem, deleteItem, updateItem };
  };
  
  export default useManageFirestore;