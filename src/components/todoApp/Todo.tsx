import React from 'react'
import PropTypes from 'prop-types'

interface Props {
    onClick: () => void,
    completed: boolean,
    text: string
}

const Todo = ({ onClick, completed, text }: Props) => (
    <li onClick={onClick} style={{ textDecoration: completed ? 'line-through' : 'none' }}  >
        {text}
    </li>
)


export default Todo
