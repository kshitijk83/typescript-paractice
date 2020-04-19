import React from 'react';
import NewTodo from './components/NewTodo';
import TodoList from './components/TodoList';
import { TodoProvider } from './context';

function App() {
  // const todos = [{id: '1', text: 'Finish The Course'}]

  return (
    <div className="App">
      <TodoProvider>
        <NewTodo />
        <TodoList/>
      </TodoProvider>
    </div>
  );
}

export default App;
