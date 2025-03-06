/*Todo.js */
import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig"; 
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from "firebase/firestore"; 
import "../styles/Todo.css";
import { FaHeart } from "react-icons/fa";

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
  const [showTodoInput, setShowTodoInput] = useState(null);

  const fetchTodos = async () => {
    const q = query(collection(db, "todos"), where("date", "==", date));
    try {
      const querySnapshot = await getDocs(q);
      const todosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("📌 Firebase에서 가져온 To-Do 데이터 구조:", JSON.stringify(todosData, null, 2)); // 콘솔 출력
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
    const categoryColor = colorPalette[categories.length]; // 색상: 카테고리 개수 순
  
    try {
      const docRef = await addDoc(collection(db, "categories"), {
        name: newCategory.trim(),
        date,
        color: categoryColor, // 색상 추가
      });
      setCategories(prevCategories => [
        ...prevCategories,
        { id: docRef.id, name: newCategory.trim(), date, color: categoryColor }, 
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
      setShowTodoInput(null); // 입력 후 입력창 숨기기
      setShowCategoryInput(false);
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
        <header className="tab-btns">
        <button onClick={() => setCurrentTab("doing")}
        className="doing-tab-btn">
          <img src="/assets/poc_icon_strawberry.png" 
          alt="doing-tab-btn"
          className="hidden-hover"/>
          <div className="show-hover">해야 할 일</div>
          </button>
        <button onClick={() => setCurrentTab("completed")} 
        className="completed-tab-btn">
        <img src="/assets/poc_icon_cake.png" alt="completed-tab-btn"
        className="hidden-hover"/>
        <div className="show-hover">완료한 일</div>
        </button>
        <button className="none-btn"></button>
        <button 
        
  className={currentTab === "edit" ? "save-btn" : "none-btn"}
  onClick={currentTab === "edit" ? saveEdit : undefined}
>
  {currentTab === "edit" ? <img src="/assets/poc_icon_check.png"/> : ""}
</button>
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
        }} 
        className="edit-tab-btn">
        <img src="/assets/poc_icon_pencile.png" alt="edit-tab-btn"
        className="hidden-hover"/>
        <div className="show-hover">수정</div>  
        </button>
        </header>
      </div>

      {currentTab === "doing" && (
        <article className="doing-container">
          <div className="in-doing-container">
          {categories.map((category, index) => (
          <div key={category.id} 
            className="category-container" 
            style={{ 
              backgroundColor: `var(--category-${index + 1}-bg)`, 
              border: `2px solid var(--category-${index + 1}-border)`
            }}
            >
          <div className="category-line"
            style={{
            }}>
      
        <img src="/assets/poc_icon_strawberry.png" 
        className="category_icon"/>
        <div
        style={{borderBottom:`2px solid var(--category-${index + 1}-border)`}} 
        className="category-name-box">
        <span 
        style={{
          textDecorationColor:`var(--category-${index + 1}-border)`}}
        className="category-name">{category.name}</span>
        </div>
      {/* + 버튼 클릭 시 해당 카테고리의 입력창 보이기 */}
      <button onClick={() => setShowTodoInput(category.id)}
      className="add-todo-btn"
      style={{ color:`var(--category-${index + 1}-text-color)`}}
      >+</button>
    </div>
    <ul>
      {todos.filter(todo => todo.categoryId === category.id && !todo.completed).map((todo) => (
        <li key={todo.id} 
          style={{ 
            listStyle: "none"
          }}
        >
          <button onClick={() => toggleComplete(todo.id)} 
            className="heart-btn"
            style={{ color: `var(--category-${index + 1}-heart)` }}
          >
            <FaHeart />
          </button>
          <input
          style={{borderBottom: `2.4px dotted var(--category-${index + 1}-dotted-border)`, }}
            type="text"
            value={todo.text}
            onChange={(e) => handleTodoChange(e, todo.id)}
          />
     
        </li>
      ))}
      {/* 특정 카테고리 선택 시 할 일 입력창 표시 */}
    {showTodoInput === category.id && (
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyDown={(e) => handleKeyDownTodo(e, category.id)}
        placeholder="할 일 입력"
        autoFocus // 자동 포커스
      />
    )}
    </ul>
  </div>
))}
          {showCategoryInput && (
            <div 
            className="category-input" 
            style={{ 
              backgroundColor: "#FAFAFA", 
              border: "2px solid #FFEBCC",
              borderRadius: "24px",
              borderBottom: "1px solid #FFEBCC",
              height:"70px",
              width:"480px",
            }}>
              <img src="/assets/poc_icon_strawberry.png" 
              className="category_icon"/>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={handleKeyDownCategory}
                placeholder="new category"
                style={{ 
                  backgroundColor: "#FAFAFA", 
                  borderBottom: "2px solid #FFEBCC",
                  height:"20px",
                  width:"450px"
                }}
              />
              
            </div>
          )}
            </div>
            <button onClick={() => setShowCategoryInput(true)} 
            className="add-category-btn"
            >+</button>
        </article>
      )}


{currentTab === "completed" && (
  <article className="completed-container">
    <div className="in-completed-container">
    {categories.map((category, index) => (
      <div key={category.id}
      className="category-container"
      style={{ 
        backgroundColor: `var(--category-${index + 1}-bg)`, 
        border: `2px solid var(--category-${index + 1}-border)`
      }}
      >
      <div className="category-line"
    style={{
      width: '450px',
      height: '60px',
      margin: '0 auto',
    }}>
      <img src="/assets/poc_icon_strawberry.png" 
      className="category_icon"/>
      <div 
      style={{ borderBottom:`2px solid var(--category-${index + 1}-border)`,
    }}
      className="category-name-box">
      <span 
      className="category-name"
      >{category.name}</span>
        </div>
        </div>
        
        <ul>
          {todos
            .filter(todo => todo.completed && todo.categoryId === category.id) // 완료된 할 일만 필터링
            .map((todo) => (

              <li key={todo.id} 
          style={{ 
            borderBottom: `2.4px dotted var(--category-${index + 1}-dotted-border)`, 
            listStyle: "none",
            fontFamily:"SUIT Variable"
          }}
        >
                <button onClick={() => toggleUnComplete(todo.id)} 
                className="heart-btn"
                style={{
                  color: `var(--category-${index + 1}-heart)`, // 실선, 하트 이모지 배경색을 사용
                }}
                ><FaHeart />
                
                </button> {/* 완료 취소 버튼 */}
                <span 
                style={{
                  backgroundColor:`var(--category-${index + 1}-highlight)`,
                }}
                >{todo.text}</span>
              </li>
            ))}
        </ul>
        
      </div>
    ))}
    </div>
  </article>
)}


{currentTab === "edit" && (
  <article className="edit-container">
    <div className="in-edit-container">
    {/* 상단에 한 개의 저장 버튼만 위치 */}

    {categories.map((category, index) => (
      <div key={category.id} 
      className={`category-container`}
      style={{ 
        backgroundColor: `var(--category-${index + 1}-bg)`, 
        border: `2px solid var(--category-${index + 1}-border)`
      }}
  > 
  <div className="category-line"
    style={{
      width: '450px',
      height: '60px',
      margin: '0 auto',
      borderBottom:`2px solid var(--category-${index + 1}-border)`
    }}>

        {category.isEditing ? (
          <>
            <img src="/assets/poc_icon_strawberry.png" 
            className="category_icon"/>          
            <input
            className="edit-category"
              type="text"
              value={category.name}
              onChange={(e) => handleCategoryChange(e, category.id)}
            />
          </>
        ) : (
          <h3>
            <img src="/assets/poc_icon_strawberry.png" 
            className="category_icon"/>
            {category.name}
          </h3>
        )}
        <button 
        className="delete-btn"
        style={{ color:`var(--category-${index + 1}-text-color)`}}
        onClick={() => deleteCategory(category.id)}>ㅡ</button>

        {/* 할 일 출력 */}
        </div>
        <ul>
        
          {todos
            .filter(todo => todo.categoryId === category.id)
            .map((todo) => (
        <li className="edit-todo-li" key={todo.id} 
          style={{ 
            listStyle: "none"
          }}
        >
          <div className="edit-heart-btn"
                style={{
                  color: `var(--category-${index + 1}-heart)`, // 실선, 하트 이모지 배경색을 사용
                }}
                ><FaHeart />
                </div>                
        {todo.isEditing ? (
                  <>          
                    <input
                    style={{borderBottom: `2.4px dotted var(--category-${index + 1}-dotted-border)`, 
                  }}
                    className="edit-todo"
                      type="text"
                      value={todo.text}
                      onChange={(e) => handleTodoChange(e, todo.id)}
                    />
                  </>
                ) : (
                  <span>{todo.text}</span>
                )}
                <button 
                className="delete-btn"
                style={{ color:`var(--category-${index + 1}-text-color)`}}
                onClick={() => deleteTodo(todo.id)}>ㅡ</button>
              </li>
            ))}
        </ul>
      </div>
    ))}
    </div>
  </article>
)}
    </div>
  );
};

export default Todo;
