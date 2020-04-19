import React from 'react'
import { cleanup, fireEvent, render } from 'test-utils'
import App from '../App'
import TodoList from '../components/TodoList'

afterEach(cleanup)

test('should have no items initially', () => {
    const {container}=render(<TodoList />)
    expect(container.textContent).toMatch("no items found")
})

test('should have added items', () => {
    const {container,getByLabelText, getByTestId} = render(<App />)
    const input= getByLabelText("Todo Text") as HTMLInputElement
    input.value = "todo1"
    const formNode = container.querySelector("form")!
    fireEvent.submit(formNode)
    // expect()

    expect(getByTestId("list").textContent).toMatch('todo1')
    expect(getByTestId("list").childNodes.length).toBe(1)

    input.value = "todo2"
    fireEvent.submit(formNode)
    expect(getByTestId("list").textContent).toMatch('todo2')
    expect(getByTestId("list").childNodes.length).toBe(2)


})


