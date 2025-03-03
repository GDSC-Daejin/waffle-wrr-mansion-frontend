import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig"; // db 가져오기
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from "firebase/firestore"; // 필요한 Firestore 메서드들

const Todo = ({ date }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  // 해당 날짜에 해당하는 todo 데이터를 Firebase에서 불러오는 함수
  const fetchTodos = async () => {
    const q = query(
      collection(db, "todos"),
      where("date", "==", date) // 날짜가 일치하는 todo만 가져옴
    );
    try {
      const querySnapshot = await getDocs(q);
      const todosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodos(todosData); // 받아온 데이터를 todos 상태에 저장
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Firebase에서 카테고리 목록을 불러오는 함수
  const fetchCategories = async () => {
    const q = query(collection(db, "categories"),
    where("date", "==", date) // 날짜가 일치하는 카테고리만 가져옴
  );
    try {
      const querySnapshot = await getDocs(q);
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData); // 받아온 카테고리 데이터를 상태에 저장
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // 카테고리 추가 함수
  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const docRef = await addDoc(collection(db, "categories"), {
        name: newCategory.trim(),
        date, // 날짜를 저장
      });
      setCategories(prevCategories => [
        ...prevCategories,
        { id: docRef.id, name: newCategory.trim(), date },
      ]);
      setNewCategory(""); // 입력창 초기화
      setShowCategoryInput(false); // 입력창 닫기
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

    // 카테고리 삭제 함수
    const deleteCategory = async (categoryId) => {
      try {
        // 해당 카테고리에 속한 할 일들도 삭제
        const categoryTodos = todos.filter(todo => todo.categoryId === categoryId);
        categoryTodos.forEach(async (todo) => {
          await deleteDoc(doc(db, "todos", todo.id)); // 할 일 삭제
        });
  
        // 카테고리 삭제
        await deleteDoc(doc(db, "categories", categoryId));
        setCategories(categories.filter(category => category.id !== categoryId)); // 상태에서 카테고리 제거
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    };

  // 할 일 추가 함수
  const addTodo = async (categoryId) => {
    if (!newTodo.trim()) return;
    try {
      const docRef = await addDoc(collection(db, "todos"), {
        categoryId,
        text: newTodo,
        completed: false,
        date, // 날짜를 저장
      });
      setTodos(prevTodos => [
        ...prevTodos,
        { id: docRef.id, categoryId, text: newTodo, completed: false, date },
      ]); // 새 할 일을 상태에 추가
      setNewTodo(""); // 입력창 초기화
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // 할 일 완료 처리
  const toggleComplete = async (todoId) => {
    try {
      const todoRef = doc(db, "todos", todoId);
      const updatedTodos = todos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      );
      await updateDoc(todoRef, { completed: !updatedTodos.find(t => t.id === todoId).completed });
      setTodos(updatedTodos); // 완료 처리된 후 상태 업데이트
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // 할 일 삭제
  const deleteTodo = async (todoId) => {
    try {
      await deleteDoc(doc(db, "todos", todoId));
      setTodos(todos.filter(todo => todo.id !== todoId)); // 삭제된 할 일 상태에서 제거
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // 카테고리 입력 시 이벤트 처리
  const handleKeyDownCategory = (e) => {
    if (e.key === "Enter") {
      addCategory();  // Enter 키로 카테고리 추가
    }
  };

  // 할 일 입력 시 이벤트 처리
  const handleKeyDownTodo = (e, categoryId) => {
    if (e.key === "Enter") {
      addTodo(categoryId);  // Enter 키로 할 일 추가
    }
  };

  // 컴포넌트가 마운트될 때 Firebase에서 데이터 불러오기
  useEffect(() => {
    fetchTodos();
    fetchCategories();
  }, [date]); // 날짜가 변경될 때마다 다시 데이터를 불러옴

  return (
    <div className="todo-container">
      <h2>{date}의 할 일</h2>

      {/* 카테고리 추가 */}
      <button onClick={() => setShowCategoryInput(true)}>+ 카테고리 추가</button>
      {showCategoryInput && (
        <div>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={handleKeyDownCategory} // Enter로 카테고리 추가
            placeholder="새 카테고리 입력"
          />
          <button onClick={() => deleteCategory(categories.id)}>삭제</button>

        </div>
      )}

      {/* 카테고리별 할 일 목록 */}
      {categories.map((category) => (
        <div key={category.id} className="category">
          <h3>{category.name}</h3>
          <div>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => handleKeyDownTodo(e, category.id)} // Enter로 할 일 추가
              placeholder="할 일 입력"
            />
            <button onClick={() => addTodo(category.id)}>+</button>
          </div>

          {/* 할 일 목록 */}
          <ul>
            {todos.filter(todo => todo.categoryId === category.id).map((todo) => (
              <li key={todo.id} className={todo.completed ? "completed" : ""}>
                <span onClick={() => toggleComplete(todo.id)}>
                  {todo.completed ? "✔️" : "⭕"} {todo.text}
                </span>
                <button onClick={() => deleteTodo(todo.id)}>삭제</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Todo;
