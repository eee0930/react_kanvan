import { motion } from "framer-motion";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const CardCover = styled.div<{isDragging: boolean}>`
    background-color: ${(props) => 
        props.isDragging ? "#74b9ff" :
        props.theme.cardColor
    };
    box-shadow: ${(props) => props.isDragging ? "0 2px 5px rgba(0, 0, 0, 0.05)": "0 1px 0 #091e4240"};
    border-radius: 3px;
    margin-bottom: 8px;
    &:last-child {
        margin-bottom: 0;
    }
    &:hover button {
        opacity: 1;
    }

    :last-child ul {
        top: -12px;
    }
`;
const Card = styled(motion.div)`
    border-radius: 3px;
    width: 100%;
    height: 100%;
    padding: 8px;
    position: relative;
`;
const ControlButton = styled.button`
    opacity: 0;
    border: none;
    border-radius: 3px;
    background-color: transparent;
    color: #888;
    font-size: 15px;
    font-weight: 600;
    position: absolute;
    padding: 2px;
    top: 3px;
    right: 3px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
`;
const Overlay = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   z-index: 5;
`;
const DropDown = styled.ul`
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    width: 80px;
    padding: 8px;
    text-align: center;
    border-radius: 3px;
    background-color: #fff;
    z-index: 10;
    border: solid 1px rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    li {
        margin-bottom: 5px;
    }
    li:last-child {
        margin-bottom: 0;
    }
`;
const MenuBtn = styled.a`
    cursor: pointer;
    &:focus {
        outline: none;
    }
`;

const Form = styled.form`
    width: 100%;
    margin-bottom: 8px;
`;
const BoardInput = styled.input`
    display: block;    
    width: 100%;
    border: none;
    background-color: #fff;
    box-shadow: inset 0 0 0 2px #0079bf;
    font-size: 14px;
    border-radius: 3px;
    line-height: 20px;
    height: 36px;
    padding: 8px 12px;
    outline: none;
    &:focus {
        outline: none;
    }
`;
const BoardAddControl = styled.div`
    height: 32px;
    margin: 4px 0 0;
    overflow: hidden;
`;
const AddButton = styled.button`
    width: 80px;
    height: 32px;
    background-color: #0079bf;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
`;
const CancelButton = styled.a`
    color: #42526e;
    height: 32px;
    font-weight: bold;
    display: inline-block;
    line-height: 32px;
    text-decoration: none;
    text-align: center;
    vertical-align: middle;
    width: 32px;
    font-size: 24px;
`;


interface IDraggableCardProps {
    toDoId: number;
    toDoText: string;
    index: number;
    boardId: string;
}
interface IEditTodo {
    editTodo: string;
}

const cardVariants = {
    initial: {
        scale: 1,
        opacity: 1,
    },
    exit: {
        scale: 0,
        opacity: 0,
        transition: {
            duration: 0.5,
        },
    },
}


function DraggableCard({toDoId, toDoText, index, boardId}: IDraggableCardProps) {
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const { register, handleSubmit, setValue } = useForm();
    const setToDos = useSetRecoilState(toDoState);
    const toggleDropDown = () => setIsDropDownOpen((prev) => !prev);
    const handleDelete = () => {
        setToDos((allBoards) => {
            const sourceBoard = [...allBoards[boardId]];
            sourceBoard.splice(index, 1);
            return {
              ...allBoards,
              [boardId]: sourceBoard,
              
            }
        })
    };
    const openEditForm = () => {
        setIsEditOpen(true);
        setIsDropDownOpen(false);
    };
    const cancelEdit = () => {
        setIsEditOpen(false);
        setValue("editTask", toDoText);
    };
    const handleEdit = ({ editTodo } : IEditTodo) => {
        setToDos((allBoards) => {
            const newTodo = {
                id: toDoId,
                text: editTodo,
            };
            const newBoard = [...allBoards[boardId].slice(0, index), newTodo, ...allBoards[boardId].slice(index + 1)];
            return {
              ...allBoards,
              [boardId]: newBoard,
            };
        });
        setValue("editTask", editTodo);
        setIsEditOpen(false);
    };

    return (<>
        {isEditOpen? (
            <Form onSubmit={handleSubmit(handleEdit as any)}>
                <BoardInput 
                    {...register("editTask", {
                        required: true,
                        value: toDoText,
                    })}
                    type="text" 
                    placeholder={`Add task on ${boardId}`} 
                />
                <BoardAddControl>
                    <AddButton>Edit</AddButton>
                    <CancelButton onClick={cancelEdit}>&times;</CancelButton>
                </BoardAddControl>
            </Form>
        ) : (
            <Draggable draggableId={toDoId + ""} index={index}>
                {(magic, snapshot) => (
                    <CardCover 
                        isDragging={snapshot.isDragging}
                        ref={magic.innerRef}
                        {...magic.dragHandleProps}
                        {...magic.draggableProps}
                    >
                        <Card variants={cardVariants} initial="initial" exit="exit">
                            {toDoText}
                            <ControlButton onClick={toggleDropDown}>&#8942;</ControlButton>
                            {isDropDownOpen && 
                            (<>
                                <Overlay onClick={() => setIsDropDownOpen(false)} />
                                <DropDown>
                                    <li><MenuBtn onClick={openEditForm}>Edit</MenuBtn></li>
                                    <li><MenuBtn onClick={handleDelete}>Delete</MenuBtn></li>
                                </DropDown>
                            </>)}
                        </Card>
                    </CardCover>
                )}
            </Draggable>
        )}
    </>)
}

export default React.memo(DraggableCard);