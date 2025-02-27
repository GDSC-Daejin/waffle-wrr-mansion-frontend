import React, { useState, useEffect } from 'react';
import { db } from '../config/firebaseConfig'; // Firebase 설정 파일에서 db import
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [category, setCategory] = useState('');
  const [taskContent, setTaskContent] = useState('');
  const [isCompletedFilter, setIsCompletedFilter] = useState(false);

  // Firebase에서 할 일 불러오기
  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    let fetchedTasks = [];
    querySnapshot.forEach((doc) => {
      fetchedTasks.push({ ...doc.data(), id: doc.id });
    });
    setTasks(fetchedTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 할 일 추가하기
  const handleAddTask = async () => {
    if (taskContent === '') return;

    try {
      const newTask = { content: taskContent, isCompleted: false };
      await addDoc(collection(db, 'tasks'), newTask);
      setTaskContent('');
      fetchTasks(); // 새로 추가된 할 일을 가져옴
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  // 할 일 수정하기
  const handleEditTask = async (id, updatedContent) => {
    const taskDoc = doc(db, 'tasks', id);
    try {
      await updateDoc(taskDoc, { content: updatedContent });
      fetchTasks(); // 수정 후 데이터 새로 가져오기
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  // 할 일 삭제하기
  const handleDeleteTask = async (id) => {
    const taskDoc = doc(db, 'tasks', id);
    try {
      await deleteDoc(taskDoc);
      fetchTasks(); // 삭제 후 데이터 새로 가져오기
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  // 할 일 완료 상태 업데이트하기
  const handleToggleComplete = async (id, isCompleted) => {
    const taskDoc = doc(db, 'tasks', id);
    try {
      await updateDoc(taskDoc, { isCompleted: !isCompleted });
      fetchTasks(); // 상태 변경 후 데이터 새로 가져오기
    } catch (error) {
      console.error('Error toggling task completion: ', error);
    }
  };

  // 완료된 할 일 필터링
  const handleFilterCompleted = () => {
    setIsCompletedFilter(!isCompletedFilter);
  };

  const filteredTasks = isCompletedFilter ? tasks.filter((task) => task.isCompleted) : tasks;

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="할 일을 입력하세요"
          value={taskContent}
          onChange={(e) => setTaskContent(e.target.value)}
        />
        <button onClick={handleAddTask}>추가</button>
      </div>

      <div>
        <button onClick={handleFilterCompleted}>
          {isCompletedFilter ? '모든 할 일 보기' : '완료된 일만 보기'}
        </button>
      </div>

      <div>
        {filteredTasks.map((task) => (
          <div key={task.id}>
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => handleToggleComplete(task.id, task.isCompleted)}
            />
            <input
              type="text"
              value={task.content}
              onChange={(e) => handleEditTask(task.id, e.target.value)}
            />
            <button onClick={() => handleDeleteTask(task.id)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;
