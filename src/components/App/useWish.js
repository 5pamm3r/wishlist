import React, { useState } from "react";
import useCategoryLocalStorage from "./useCategoryLocalStorage";
import { useLocalStorage } from "./useLocalStorage";

function useWish() {
  const { item, saveItem, sincronizeItem, loading, error } = useLocalStorage(
    "WISHLIST_V1",
    []
  ); //primero el elemento (item), segundo la actualización del mismo (saveItem).
  const { category, saveCategory, catLoading, catError, sincronizeCategory } =
    useCategoryLocalStorage("WISHLIST-CAT_V1", []);

  const [searchValue, setSearchValue] = React.useState("");

  const [openItemModal, setOpenItemModal] = React.useState(false);
  const [openCategModal, setOpenCategModal] = React.useState(false);

  const totalItemCategory = (category) => {
    const totalItem = item.filter((e) => e.categorie === category).length;
    return totalItem;
  };

  const itemCompleted = item.filter((todo) => !!todo.completed).length;
  const itemTotal = item.length;
  let searchedTodos = [];

  const progressColor = (title) => {
    let className = "";
    title === "personal"
      ? (className = "progressBar-personal")
      : (className = "progressBar-business");
    return className;
  };

  const categoriesCompleted = (cantItems, item, title) => {
    const cantCompleted = item.filter(
      (i) => i.completed && i.categorie === title
    ).length;
    const progress = (cantCompleted * 100) / cantItems;
    return progress;
  };

  const [newValue, setNewValue] = React.useState("");

  if (!searchValue.length >= 1) {
    searchedTodos = item;
  } else {
    searchedTodos = item.filter((todo) => {
      const todoText = todo.text.toLowerCase();
      const searchText = searchValue.toLowerCase();
      return todoText.includes(searchText);
    });
  }

  //Guarda el nuevo array en localStorage y en estado global.
  const add = (text) => {
    const newTodos = [...item];
    // categorieValue = categorie;
    newTodos.push({
      completed: false,
      text: text,
    });
    saveItem(newTodos);
  };
  const addCategory = (categoryName, color) => {
    const newCategory = [...category];
    newCategory.push({
      title: categoryName,
      count: totalItemCategory(categoryName),
      color: color
    });
    saveCategory(newCategory);
  };

  const toggleCompletedTodos = (text) => {
    const todoIndex = item.findIndex((todo) => todo.text === text);
    const newTodos = [...item];
    newTodos[todoIndex].completed = !newTodos[todoIndex].completed;
    saveItem(newTodos);
  };

  const deleteTodo = (text) => {
    const todoIndex = item.findIndex((todo) => todo.text === text);
    const newTodos = [...item];
    newTodos.splice(todoIndex, 1);
    saveItem(newTodos);
  };

  const state = {
    item,
    loading,
    error,
    searchedTodos,
    itemTotal,
    itemCompleted,
    searchValue,
    openItemModal,
    openCategModal,
    category,
    addCategory,
    categoriesCompleted,
    newValue
  };
  const stateUpdaters = {
    add,
    toggleCompletedTodos,
    setSearchValue,
    deleteTodo,
    sincronizeItem,
    setOpenItemModal,
    setOpenCategModal,
    progressColor,
    setNewValue
  };

  return { state, stateUpdaters };
}

export { useWish };
