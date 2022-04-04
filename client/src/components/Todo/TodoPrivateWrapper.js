import React from "react";

import TodoInput from "./TodoInput";
import TodoPrivateList from "./TodoPrivateList";

const TodoPrivateWrapper = () => {
  return (
    <div>
    <div className="todoWrapper">
      <div className="sectionHeader"> TODOS</div>
      <TodoInput />
      <TodoPrivateList />
    </div>
    </div>
  );
};

export default TodoPrivateWrapper;
