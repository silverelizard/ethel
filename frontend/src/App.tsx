import { useState, useEffect } from 'react';
import { Bottle, getBottles } from './client/bottles';
import './App.css';
import BottleTable from './components/BottleTable';

function App() {
  const [bottles, setBottles] = useState<Bottle[]>([]);
  
  useEffect(() => {
    getBottles().then(bottles => setBottles(bottles));
  }, []);

  return (
    <BottleTable bottles={bottles} />
  );

}

export default App;
