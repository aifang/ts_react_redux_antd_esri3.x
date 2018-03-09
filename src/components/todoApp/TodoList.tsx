import React from 'react'
import PropTypes from 'prop-types'
import Todo from './Todo'


interface Prop {
    todos: { id: number, completed: boolean, text: string }[]
    onTodoClick:Function
}

const TodoList = ({ todos, onTodoClick }:Prop) => (
    <ul>
        {todos.map(todo =>
            <Todo
                key={todo.id}
                {...todo}
                onClick={() => onTodoClick(todo.id)}
            />
        )}
    </ul>
)

export default TodoList
