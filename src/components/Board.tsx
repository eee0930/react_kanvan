import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { ITodo } from "../atoms";
import CreateTask from "./CreateTask";

const WrapperContainer = styled.div`
    display: inline-block;
    height: calc(100% - 5px);
    vertical-align: top;
    white-space: nowrap;
    width: 250px;
`;
const Wrapper = styled.div`
    min-width: 250px;  
    padding-top: 10px;
    background-color: ${(props) => props.theme.boardColor};
    border-radius: 3px;
    min-height: 100px;
    height: auto;
    display: flex;
    flex-direction: column;
    white-space: normal;
    max-height: 100%;
`;
const Title = styled.h2`
    text-align: center;
    font-weight: 600;
    margin-bottom: 10px;
    font-size: 18px;
`;
const Area = styled.div<IAreaProps>`
    background-color: ${
        props => props.isDraggingOver ? "#dfe6e9" : 
        props.isDraggingFromThis ? "#b2bec3" : "transparent"
    };
    flex-grow: 1;
    transition: background-color 0.3s ease-in-out;
    padding: 8px;
    overflow-y: auto;
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        background-clip: padding-box;
    }
    &::-webkit-scrollbar-track {
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 6px;
    }
`;

interface IAreaProps {
    isDraggingOver: boolean;
    isDraggingFromThis: boolean;
}

interface IBoardProps {
    toDos: ITodo[];
    boardId: string;
}

function Board({ toDos, boardId }: IBoardProps) {
    return (
        <WrapperContainer>
            <Wrapper>
                <Title>{boardId}</Title>
                <Droppable droppableId={boardId}>
                    {(magic, snapshot) => (
                        <Area
                            isDraggingOver={snapshot.isDraggingOver}
                            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                            ref={magic.innerRef} 
                            {...magic.droppableProps}>
                            {toDos.map((toDo, index) => (
                            <DraggableCard 
                                key={toDo.id} 
                                index={index} 
                                toDoId={toDo.id} 
                                toDoText={toDo.text} 
                                boardId={boardId}
                            />
                            ))}
                            {magic.placeholder}
                        </Area>
                    )}
                </Droppable>
                <CreateTask boardId={boardId} />
            </Wrapper>
        </WrapperContainer>
    )
}

export default Board;