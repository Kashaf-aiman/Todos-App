/* eslint-disable react/jsx-no-comment-textnodes */
import React from "react";
import { gql, useMutation } from "@apollo/client";
import {FETCH_PRIVATE_TODOS } from "./TodoPrivateList";
const TodoItem = ({ todo }) => {

  const REMOVE_TODO_MUTATION = gql`
  mutation removeTodo ($id: Int!) {
    delete_todos(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }  `;

  const [removeTodoMation] = useMutation(REMOVE_TODO_MUTATION);

  const removeTodo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeTodoMation({
      variables: { id:todo.id },
      update: (cache) => {
        
        //read query from cache
        const existingTodos = cache.readQuery({query:FETCH_PRIVATE_TODOS});

        //process data 
        const newTodos = existingTodos.todos.filter(t => (t.id !== todo.id));

        //write back into cache
        cache.writeQuery({
          query:FETCH_PRIVATE_TODOS , 
          data:{todos:newTodos}
        });
      }
    })
  };


const TOOGLE_TODO_MUTATION = gql `
  mutation toggleTodo ($id: Int!, $isCompleted: Boolean!) {
    update_todos(where: {id: {_eq: $id}}, _set: {is_completed: $isCompleted}) {
      affected_rows
    }
  }`;

const [toggleTodoMutation] = useMutation(TOOGLE_TODO_MUTATION);


  const toggleTodo = () => {
    toggleTodoMutation({
      variables: { id: todo.id, isCompleted:!todo.is_completed },
      optimisticResponse:true,
      update: (cache) => {

        //read cache
        const existingTodos = cache.readQuery({query: FETCH_PRIVATE_TODOS});

        //process data
        const newTodos = existingTodos.todos.map((t) => {
          if(t.id === todo.id) {
            return { ...t, is_completed: !t.is_completed};
          }else {
            return t;
          }
        });

        //write back into cache
        cache.writeQuery({
          query: FETCH_PRIVATE_TODOS,
          data: { todos: newTodos }
        })

      }
    })
  };

  return (
    <li>
      <div className="view">
        <div className="round">
          <input
            checked={todo.is_completed}
            type="checkbox"
            id={todo.id}
            onChange={toggleTodo}
          />
          <label htmlFor={todo.id} />
        </div>
      </div>

      
      <div className={"labelContent" + (todo.is_completed ? " completed" : "")}>
        
        <div>{todo.title}</div>
      </div>

      <button className="closeBtn" onClick={removeTodo}>
        x
      </button>
    </li>
  );
};

export default TodoItem;
