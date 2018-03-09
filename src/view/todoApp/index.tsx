import * as React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import Footer from '../../components/todoApp/Footer'
import AddTodo from '../../containers/todoApp/AddTodo'
import VisibleTodoList from '../../containers/todoApp/VisibleTodoList'



const TodoApp = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
    </div>
);


export default TodoApp;
