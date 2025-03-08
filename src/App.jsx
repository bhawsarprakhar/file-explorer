import React, { useState } from "react";
import json from "./data.json";
import "./app.css";
import { FaFolderPlus } from "react-icons/fa";
import { MdDelete, MdEdit, MdKeyboardArrowDown } from "react-icons/md";

const List = ({ list, addNodeToList, deleteNodeFromList, renameNode }) => {
  const [isExpanded, setIsExpanded] = useState({});

  return (
    <div className="container">
      {list.map((node) => (
        <div key={node.id}>
          {node.isFolder && (
            <span
              onClick={() =>
                setIsExpanded((prev) => ({
                  ...prev,
                  [node.id]: !prev[node.id],
                }))
              }
            >
              {isExpanded?.[node.id] ? <MdKeyboardArrowDown /> : "+"}
            </span>
          )}
          <span> {node.name} </span>
          {node?.isFolder && (
            <span className="add-folder" onClick={() => addNodeToList(node.id)}>
              <FaFolderPlus />
            </span>
          )}
          <span onClick={() => renameNode(node.id)}>
            <MdEdit />
          </span>
          <span onClick={() => deleteNodeFromList(node.id)}>
            <MdDelete />
          </span>
          {isExpanded?.[node.id] && node?.children && (
            <List
              list={node.children}
              addNodeToList={addNodeToList}
              deleteNodeFromList={deleteNodeFromList}
              renameNode={renameNode}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [data, setData] = useState(json);

  const addNodeToList = (parentId) => {
    const name = prompt("Enter Folder Name");
    if (!name) return;

    const updateTree = (list) =>
      list.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [
              ...node.children,
              {
                id: Date.now().toString(),
                name: name,
                isFolder: true,
                children: [],
              },
            ],
          };
        }
        if (node.children) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });

    setData((prev) => updateTree(prev));
  };

  const deleteNodeFromList = (itemId) => {
    const updateTree = (list) =>
      list
        .filter((node) => node.id !== itemId)
        .map((node) => {
          if (node.children) {
            return { ...node, children: updateTree(node.children) };
          }
          return node;
        });

    setData((prev) => updateTree(prev));
  };

  const renameNode = (itemId) => {
    const newName = prompt("Enter new name");
    if (!newName) return;

    const updateTree = (list) =>
      list.map((node) => {
        if (node.id === itemId) {
          return { ...node, name: newName };
        }
        if (node.children) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });

    setData((prev) => updateTree(prev));
  };

  return (
    <div className="app">
      <h1>File/Folder Explorer</h1>
      <List
        list={data}
        addNodeToList={addNodeToList}
        deleteNodeFromList={deleteNodeFromList}
        renameNode={renameNode}
      />
    </div>
  );
};

export default App;
