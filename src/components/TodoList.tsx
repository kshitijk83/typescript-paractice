import React from 'react';
import { useTodo } from '../context';
import './TodoList.css';
// interface Props{
//     items: {id: string, text: string}[]
// }

const TodoList: React.FC=()=>{
    const {state} = useTodo()
    const list =state[0]?(state.map(todo=><li key ={todo.id}>{todo.text}</li>)):"no items found"
    return(
        <ul>
            {list}
        </ul>
    )
}

export default TodoList;