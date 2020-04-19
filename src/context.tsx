import React, { Dispatch, useReducer } from 'react'

type todo ={
    id: string,
    text: string
}
interface Action{
    type: "ADD"|"REMOVE";
    [x: string]: any;
}

type x=[todo[], Dispatch<Action>]

const TodoContext = React.createContext<x>([[], ()=>{}])

type countReducer= (initState: todo[], action: Action)=>todo[]
function countReducer(initState: todo[], action: Action){
    switch (action.type) {
        case 'ADD':
            return[
                ...initState,
                {
                    id: Math.random().toString(),
                    text: action.text
                }
            ]
        
        case 'REMOVE':
            return initState.filter(todo=>todo.id!==action.id)
        default:
            throw new Error("error!!!!")
    }
}

const TodoProvider: React.FC=(props)=>{
    const [state, dispatch] = useReducer(countReducer, [])
    // const value = React.useMemo(()=>[state, dispatch], [state, dispatch])
    return <TodoContext.Provider value={[state, dispatch]} {...props} />
}

const useTodo=()=>{
    const context = React.useContext(TodoContext)
    if (!context) {
        throw new Error(`useCount must be used within a CountProvider`)
      }
    const [state, dispatch] = context
    return {state, dispatch}
}

export { TodoProvider, useTodo }

