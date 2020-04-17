import { render } from '@testing-library/react'
import React from 'react'
import App from '../App'
test("test1",()=>{
    const {getByText} = render(<App />)
    expect(getByText("sdf").className).toContain("App")
})