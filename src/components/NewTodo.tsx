import React, { useRef } from 'react';
import { useTodo } from '../context';
import './NewTodo.css';

const NewTodo: React.FC=()=>{
    const {dispatch} = useTodo()
    const textInputRef = useRef<HTMLInputElement>(null);
    const submitHandler=(event: React.FormEvent)=>{
        event.preventDefault()
        const text = textInputRef.current?.value
        dispatch({type: "ADD", text: text})
        
    }
    return(
        <form onSubmit={submitHandler}>
            <div>
                <label htmlFor="todo-text">Todo Text</label>
                <input ref={textInputRef} type="text" id="todo-text"/>
            </div>
            <button type="submit">ADD TODO</button>
        </form>
    )
}

export default NewTodo;