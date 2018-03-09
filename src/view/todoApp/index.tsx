import * as React from 'react'
import AddTodo from '../../components/todoApp/containers/AddTodo';
import VisibleTodoList from '../../components/todoApp/containers/VisibleTodoList';
import Footer from '../../components/todoApp/components/Footer';

const TodoApp = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
    </div>
);


export default TodoApp;