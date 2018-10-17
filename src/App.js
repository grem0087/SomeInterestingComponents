import React, { Component } from "react";
import Input from 'arui-feather/input';

const App = () => {
  return (    
    <div>
      <Input
        size='m'
        placeholder='Введите сумму'
        type='number'
      />
      
      <p>React here!</p>
    </div>
  );
};

export default App;

