import { render } from '@testing-library/react'
import React from 'react'
import NewTodo from '../components/NewTodo'

test('should ', () => {
    const {getByLabelText} = render(<NewTodo/>)
    const text = getByLabelText("todo-text")
    // console.log(text)
})
