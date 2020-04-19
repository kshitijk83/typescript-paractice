import { cleanup, render } from '@testing-library/react'
import React from 'react'
import TodoList from '../components/TodoList'


afterEach(cleanup)

test("no items found",()=>{
    const {container, getByText} = render(<TodoList items={[]} />)
    expect(container.textContent).toMatch("no items found")

})

test('should items found', () => {
    const { container } = render(<TodoList items={[{id: '1', text: 'Finish The Course'}]} />)
    expect(container.textContent).toMatch("Finish The Course")

})
