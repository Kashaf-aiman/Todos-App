import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { FETCH_PRIVATE_TODOS } from "./TodoPrivateList";

const INSERT_TODO_MUTATION = gql`
mutation ($todo: String!, $isPublic: Boolean!) {
  insert_todos(objects: {title: $todo, is_public: $isPublic}) {
    affected_rows
    returning {
      id
      title
      created_at
      is_completed
    }
  }
}
`

const TodoInput = ({ isPublic = false }) => {
  const[todoInput, setTodoInput] = useState('')

  const updateCache = (cache, {data}) => {
    //read data from caches
    const existingTodos = cache.readQuery({
      query: FETCH_PRIVATE_TODOS 
    });

    //read the newly inserted todo item
    const newTodo = data.insert_todos.returning[0];

    //combine the new todo with the existing todos.
    //write into cache
    cache.writeQuery({
      query: FETCH_PRIVATE_TODOS,
      data: { todos: [...existingTodos.todos, newTodo ]}
    })
    setTodoInput('');
  }
  
  const [addTodo] = useMutation(INSERT_TODO_MUTATION, { update:updateCache })
  
  return (
    <form
      className="formInput"
      onSubmit={e => {
        e.preventDefault();
        addTodo({
         variables: {todo:todoInput, isPublic:isPublic}
        })
      }}
    >
      <input 
      className="input" 
      placeholder="What needs to be done?"
      value={todoInput}
      onChange={(e) => setTodoInput(e.target.value)}
      />
      <i className="inputMarker fa fa-angle-right" />
    </form>
  );
};

export default TodoInput;
