import React from 'react';
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from 'recoil';
import styled from "styled-components";
import { toDoState } from './atoms';
import Board from './components/Board';
import CreateBoard from './components/CreateBoard';
import { Helmet } from 'react-helmet';
import TaskTrash from './components/TaskTrash';

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  padding: 15px;
  margin-top: 80px;
  height: calc(100vh - 80px);
`;

const Boards = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  white-space: nowrap;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 12px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 6px;
    background-clip: padding-box;
    
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    
  }
`;


function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if(!destination) return;
    if(destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if(destination?.droppableId === "trash") {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        sourceBoard.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
        }
      })
    } else if(destination.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        }
      });
    };
  };

  return (
    <>
    <Helmet>
      <title>React Kanvan</title>
    </Helmet>

    {/* Area of ToDo Boards */}
    <DragDropContext onDragEnd={onDragEnd}>
      <TaskTrash />
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => 
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
          )}
          <CreateBoard />
        </Boards>
      </Wrapper>
    </DragDropContext>
    </>
  );
}

export default App;
