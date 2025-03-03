import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";

const CategoryList = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userId = user?.uid;
  const todayDate = new Date().toISOString().split('T')[0];

  // Firestore에서 카테고리 목록을 가져오기
  useEffect(() => {
    if (!userId) return;

    const categoriesRef = collection(db, "users", userId, "daily", todayDate, "categories");
    const unsubscribe = onSnapshot(categoriesRef, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();  // Cleanup
  }, [userId, todayDate]);

  // 카테고리 추가
  const addCategory = async () => {
    if (!newCategory.trim()) return;

    setIsLoading(true);
    const newCategoryRef = doc(collection(db, "users", userId, "daily", todayDate, "categories"));
    await setDoc(newCategoryRef, {
      name: newCategory,
      todos: []  // 새로운 카테고리는 비어있는 todos 배열로 시작
    });
    setNewCategory("");
    setIsLoading(false);
  };

  return (
    <div className="category-list">
      <h2>카테고리</h2>
      <div className="add-category">
        <input
          type="text"
          placeholder="새로운 카테고리 추가"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={addCategory} disabled={isLoading}>
          {isLoading ? "추가 중..." : "추가"}
        </button>
      </div>

      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <span>{category.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
