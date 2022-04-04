import React, { useState, Fragment } from "react";

import { gql, useQuery, useMutation } from '@apollo/client';

import TodoItem from "./TodoItem";
import TodoFilters from "./TodoFilters";

const FETCH_PRIVATE_TODOS = gql`
  query fetchPrivateTodos {
    todos {
      id
      title
      is_public
      is_completed
    }
  }`

  const REMOVE_COMPLETED_TODOS = gql`
    mutation clearCompleted {
      delete_todos(where: {is_completed: {_eq: true}, is_public: {_eq: false}}) {
        affected_rows
      }
    }
  `;

const TodoPrivateList = (props) => {
  const [state, setState] = useState({
    filter: "all",
    clearInProgress: false,
    todos: [
      {
        id: "1",
        title: "This is private todo 1",
        is_completed: true,
        is_public: false,
      },
      {
        id: "2",
        title: "This is private todo 2",
        is_completed: false,
        is_public: false,
      },
    ],
  });

  const filterResults = (filter) => {
    setState({
      ...state,
      filter: filter,
    });
  };

  const [removeCompletedTodos]  = useMutation(REMOVE_COMPLETED_TODOS);

  const clearCompleted = () => {
    removeCompletedTodos({
      optimisticResponse:true,
      update: (cache) => {

        //read query 
        const existingTodos = cache.readQuery({query: FETCH_PRIVATE_TODOS});
        //process 
        const newTodos = existingTodos.todos.filter((t) => (!t.is_completed));
        //write into cache
        cache.writeQuery({
          query: FETCH_PRIVATE_TODOS,
          data:{todos: newTodos} 
        })
      }
    })
  };

  const { todos } = props;

  let filteredTodos = todos;
  if (state.filter === "active") {
    filteredTodos = todos.filter((todo) => todo.is_completed !== true);
  } else if (state.filter === "completed") {
    filteredTodos = todos.filter((todo) => todo.is_completed === true);
  }

  const todoList = [];
  filteredTodos.forEach((todo, index) => {
    todoList.push(<TodoItem key={index} index={index} todo={todo} />);
  });

  return (
    <Fragment>
      <div className="todoListWrapper">
        <ul>{todoList}</ul>
      </div>

      <TodoFilters
        todos={filteredTodos}
        currentFilter={state.filter}
        filterResultsFn={filterResults}
        clearCompletedFn={clearCompleted}
        clearInProgress={state.clearInProgress}
      />
    </Fragment>
  );
};

const TodoPrivateListQuery = () => {
  const { loading, error, data } = useQuery(FETCH_PRIVATE_TODOS);
  if(loading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div>This is an error...</div>
  }
  return <TodoPrivateList todos={data.todos} />
};

// export default TodoPrivateList;
export default TodoPrivateListQuery;
export {FETCH_PRIVATE_TODOS};
