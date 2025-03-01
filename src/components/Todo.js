import React from "react";

function Todo({ todos }) {
  return (
    <div className="todo-container">
      <h3>Today's Todo</h3>
      {todos.length > 0 ? (
        <ul>
          {todos.map((todo, index) => (
            <li key={index}>
              <input type="checkbox" checked={todo.completed} readOnly />
              {todo.text}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks for today.</p>
      )}
    </div>
  );
}

export default Todo;
