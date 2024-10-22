import { useState, useEffect } from 'react';
import { Bottle, getBottles } from './client/bottles';
import './App.css';
import BottleTable from './components/BottleTable';
import { Category, getCategories } from './client/categories';
import { getSubCategories, SubCategory } from './client/subCategories';
import { getStorage, Storage } from './client/storage';

function App() {
  const [categories, setCategories] = useState<{ [id: number] : Category; }>({});
  const [subCategories, setSubCategories] = useState<{ [id: number] : SubCategory; }>({});
  const [storage, setStorage] = useState<{ [id: number] : Storage; }>({});
  const [bottles, setBottles] = useState<Bottle[]>([]);

  useEffect(() => {
    getCategories().then(categories => setCategories(categories));
  }, []);

  useEffect(() => {
    getSubCategories().then(subCategories => setSubCategories(subCategories));
  }, []);

  useEffect(() => {
    getStorage().then(storage => setStorage(storage));
  }, []);

  useEffect(() => {
    getBottles().then(bottles => setBottles(bottles));
  }, []);

  return (
    <BottleTable bottles={bottles} categories={categories} subCategories={subCategories} storage={storage} />
  );

}

export default App;
