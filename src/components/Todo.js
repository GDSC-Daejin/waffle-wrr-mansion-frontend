/*Todo.js */
import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig"; 
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from "firebase/firestore"; 

const colorPalette = [
  ["#FFEBCC"], // category-1 색상 세트
  ["#FFBCD4"], // category-2 색상 세트
  ["#FFD1D8"], // category-3 색상 세트
  ["#D5EDCC"], // category-4 색상 세트
  ["#B4E5E0"], // category-5 색상 세트
  ["#E2DFFF"] // category-6 색상 세트
];

const Todo = ({ date }) => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [currentTab, setCurrentTab] = useState("doing");

  const fetchTodos = async () => {
    const q = query(collection(db, "todos"), where("date", "==", date));
    try {
      const querySnapshot = await getDocs(q);
      const todosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodos(todosData);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const fetchCategories = async () => {
    const q = query(collection(db, "categories"), where("date", "==", date));
    try {
      const querySnapshot = await getDocs(q);
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    if (categories.length >= 6) { // 카테고리 최대 6개 제한
      alert("카테고리는 최대 6개만 추가할 수 있습니다.");
      return;
    }
  
    // 색상 배열에서 색상 가져오기
    const categoryColor = colorPalette[categories.length]; // 색상은 카테고리 개수 순으로 설정
  
    try {
      const docRef = await addDoc(collection(db, "categories"), {
        name: newCategory.trim(),
        date,
        color: categoryColor, // 색상 추가
      });
      setCategories(prevCategories => [
        ...prevCategories,
        { id: docRef.id, name: newCategory.trim(), date, color: categoryColor }, // 색상 포함
      ]);
      setNewCategory("");
      setShowCategoryInput(false);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };
    
  const addTodo = async (categoryId) => {
    if (!newTodo.trim()) return;
    const categoryTodos = todos.filter(todo => todo.categoryId === categoryId);
    if (categoryTodos.length >= 10) { // 한 카테고리당 할 일 최대 10개 제한
      alert("이 카테고리는 최대 10개의 할 일만 추가할 수 있습니다.");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "todos"), {
        categoryId,
        text: newTodo,
        completed: false,
        date,
      });
      setTodos(prevTodos => [
        ...prevTodos,
        { id: docRef.id, categoryId, text: newTodo, completed: false, date },
      ]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleComplete = async (todoId) => {
    try {
      const todoRef = doc(db, "todos", todoId);
      const updatedTodos = todos.map(todo =>
        todo.id === todoId ? { ...todo, completed: true } : todo // completed를 true로 설정
      );
  
      // Firebase에서 완료 상태 업데이트
      await updateDoc(todoRef, { completed: true });
  
      // 상태 업데이트
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };
  const toggleUnComplete = async (todoId) => {
    try {
      const todoRef = doc(db, "todos", todoId);
      const updatedTodos = todos.map(todo =>
        todo.id === todoId ? { ...todo, completed: false } : todo // completed를 false 설정
      );
  
      // Firebase에서 완료 상태 업데이트
      await updateDoc(todoRef, { completed: false });
  
      // 상태 업데이트
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };


  const deleteCategory = async (categoryId) => {
    try {
      // 1. 해당 카테고리와 관련된 할 일 삭제
      const categoryTodos = todos.filter(todo => todo.categoryId === categoryId);
      categoryTodos.forEach(async (todo) => {
        // 할 일 삭제
        await deleteDoc(doc(db, "todos", todo.id));
  
        // 해당 할 일에 연결된 시간 블록도 삭제
        const timeBlocksRef = collection(db, "timeBlocks");
        const q = query(timeBlocksRef, where("todo", "==", todo.id));  // 할 일 ID로 시간 블록 찾기
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);  // 시간 블록 삭제
        });
      });
  
      // 2. 카테고리 삭제
      await deleteDoc(doc(db, "categories", categoryId));
  
      // 3. 상태 업데이트
      setCategories(categories.filter(category => category.id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  

  const deleteTodo = async (todoId) => {
    try {
      // 1. 할 일 삭제
      await deleteDoc(doc(db, "todos", todoId));
      setTodos(todos.filter(todo => todo.id !== todoId));
  
      // 2. 해당 할 일에 해당하는 시간 블록을 찾고 삭제
      const timeBlocksRef = collection(db, "timeBlocks");
      const q = query(timeBlocksRef, where("todo", "==", todoId));  // 할 일 ID로 시간 블록 찾기
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);  // 시간 블록 삭제
      });
  
      console.log("할 일과 관련된 시간 블록이 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };
  

  const saveEdit = () => {
    // 모든 카테고리 수정
    categories.forEach((category) => {
      if (category.isEditing) {
        categorySaveEdit(category.id, category.name); // 카테고리 이름 수정
      }
    });
  
    // 모든 할 일 수정
    todos.forEach((todo) => {
      if (todo.isEditing) {
        todoSaveEdit(todo.id, todo.text); // 할 일 텍스트 수정
      }
    });
  };
  
  const categorySaveEdit = async (categoryId, newCategoryName) => {
    try {
      const categoryRef = doc(db, "categories", categoryId);
      await updateDoc(categoryRef, { name: newCategoryName });
  
      // 상태 업데이트: 카테고리 이름 수정
      const updatedCategories = categories.map(category =>
        category.id === categoryId ? { ...category, name: newCategoryName, isEditing: false } : category
      );
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error saving category edit:", error);
    }
  };
  const todoSaveEdit = async (todoId, newText) => {
    try {
      const todoRef = doc(db, "todos", todoId);
      await updateDoc(todoRef, { text: newText });
  
      // 상태 업데이트: 할 일 텍스트 수정
      const updatedTodos = todos.map(todo =>
        todo.id === todoId ? { ...todo, text: newText, isEditing: false } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error saving todo edit:", error);
    }
  };
  

  const handleTodoChange = (e, todoId) => {
    const updatedTodos = todos.map(todo =>
      todo.id === todoId ? { ...todo, text: e.target.value } : todo
    );
    setTodos(updatedTodos);
  };

  const handleCategoryChange = (e, categoryId) => {
    const updatedCategories = categories.map(category =>
      category.id === categoryId ? { ...category, name: e.target.value } : category
    );
    setCategories(updatedCategories);
  };

  const handleKeyDownCategory = (e) => {
    if (e.key === "Enter") {
      addCategory();
    }
  };

  const handleKeyDownTodo = (e, categoryId) => {
    if (e.key === "Enter") {
      addTodo(categoryId);
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchCategories();
  }, [date]);

  return (
    <div className="todo-container">
      <div>
        <button onClick={() => setCurrentTab("doing")}>해야 할 일</button>
        <button onClick={() => setCurrentTab("completed")}>완료</button>
        <button onClick={() => {
          setCurrentTab("edit");

          const updatedTodos = todos.map(todo => ({
            ...todo,
            isEditing: true,  // 모든 할 일 항목을 수정 가능 상태로 설정
          }));

          const updatedCategories = categories.map(category => ({
            ...category,
            isEditing: true,  // 모든 카테고리 항목을 수정 가능 상태로 설정
          }));

          setTodos(updatedTodos);  // 상태 업데이트
          setCategories(updatedCategories);  // 카테고리도 수정 가능 상태로 설정
        }}>✏️</button>
      </div>

      {currentTab === "doing" && (
        <article className="doing-container">
          <button onClick={() => setShowCategoryInput(true)}>+ 카테고리 추가</button>
          {showCategoryInput && (
            <div>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={handleKeyDownCategory}
                placeholder="새 카테고리 입력"
              />
            </div>
          )}

          {categories.map((category) => (
            <div key={category.id} className="category" 
            style={{ backgroundColor: category.color }}>              
            <h3>{category.name}</h3>
              <div>
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => handleKeyDownTodo(e, category.id)}
                  placeholder="할 일 입력"
                />
              </div>

              <ul>
                {todos.filter(todo => todo.categoryId === category.id && !todo.completed).map((todo) => (
                  <li key={todo.id} style={{ backgroundColor: category.color }}>
                    <input
                      type="text"
                      value={todo.text}
                      onChange={(e) => handleTodoChange(e, todo.id)}
                    />
                    <button onClick={() => toggleComplete(todo.id)}>❤️</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </article>
      )}

{currentTab === "completed" && (
  <article className="completed-container">
    {categories.map((category) => (
      <div key={category.id} className="category" 
      style={{ backgroundColor: category.color }}>              
      <h3>{category.name}</h3>
        <ul>
          {todos
            .filter(todo => todo.completed && todo.categoryId === category.id) // 완료된 할 일만 필터링
            .map((todo) => (
              <li key={todo.id} style={{ backgroundColor: category.color }}>
                <span>{todo.text}</span>
                <button onClick={() => toggleUnComplete(todo.id)}>💔</button> {/* 완료 취소 버튼 */}
              </li>
            ))}
        </ul>
      </div>
    ))}
  </article>
)}


{currentTab === "edit" && (
  <article className="edit-container">
    {/* 상단에 한 개의 저장 버튼만 위치 */}
    <button onClick={saveEdit}>저장</button>

    {categories.map((category) => (
      <div key={category.id} className="category" 
      style={{ backgroundColor: category.color }}> 
        {category.isEditing ? (
          <>
            <input
              type="text"
              value={category.name}
              onChange={(e) => handleCategoryChange(e, category.id)}
            />
          </>
        ) : (
          <h3>{category.name}</h3>
        )}
        <button onClick={() => deleteCategory(category.id)}>삭제</button>

        {/* 할 일 출력 */}
        <ul>
          {todos
            .filter(todo => todo.categoryId === category.id)
            .map((todo) => (
              <li key={todo.id} style={{ backgroundColor: category.color }}>
                {todo.isEditing ? (
                  <>
                    <input
                      type="text"
                      value={todo.text}
                      onChange={(e) => handleTodoChange(e, todo.id)}
                    />
                  </>
                ) : (
                  <span>{todo.text}</span>
                )}
                <button onClick={() => deleteTodo(todo.id)}>삭제</button>
              </li>
            ))}
        </ul>
      </div>
    ))}
  </article>
)}
    </div>
  );
};

export default Todo;
