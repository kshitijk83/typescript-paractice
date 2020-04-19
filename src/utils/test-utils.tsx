import { render } from '@testing-library/react'
import React from 'react'
import { TodoProvider } from '../context'

const Provider: React.FC = (props)=>{
    return (
        <TodoProvider {...props} />
    )
}
const customRenderer=(ui: React.ReactElement, options?:any)=>{
    return render(ui, {wrapper: Provider, ...options})
}

export * from '@testing-library/react'
export { customRenderer as render }

