import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const FormContainer = styled.div`
    padding: 8px;
`;
const AddCard = styled.button`
    width: 100%;
    border: none;
    background-color: transparent;
    padding: 8px;
    padding-right: 15px;
    color: #5e6c84;
    transition: background-color 0.3s ease-in-out;
    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
`;
const Form = styled.form`
    width: 100%;
`;
const Input = styled.textarea`
    width: 100%;  
    display: block;  
    border: none;
    border-radius: 3px;
    padding: 8px;
    min-height: 50px;
    box-shadow: 0 1px 0 #091e4240;
    resize: none;
    font-size: 16px;
    font-family: 'Source Sans Pro', sans-serif;
`;  
const TodoAddControl = styled.div`
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

interface ICreateToDo {
    boardId: string;
}
interface IForm {
    toDo: string;
}

function CreateTask({boardId}: ICreateToDo) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    const setToDos = useSetRecoilState(toDoState);
    const { register, setValue, handleSubmit, setFocus } = useForm<IForm>();
    const onValid = ({ toDo }:IForm) => {
        const newToDo = {
            id: Date.now(),
            text: toDo,
        }
        setToDos((allBoards) => {
            return {
                ...allBoards,
                [boardId]: [
                    ...allBoards[boardId],
                    newToDo
                ]
            }
        })
        setValue("toDo", "");
    }

    const handleOpenForm = () => {
        setIsFormOpen(true);
        setFocus("toDo");
    }
    const cancelAddTodo = () => {
        setIsFormOpen(false);
        setValue("toDo", "");
    }
    return (
        <FormContainer>
            {isFormOpen? (
                <Form onSubmit={handleSubmit(onValid)}>
                    <Input 
                        {...register("toDo", {required: true})} 
                        placeholder={`Add task on ${boardId}`} 
                    />
                    <TodoAddControl>
                        <AddButton>Add</AddButton>
                        <CancelButton onClick={cancelAddTodo}>&times;</CancelButton>
                    </TodoAddControl>
                </Form>
            ):(
                <AddCard onClick={handleOpenForm}>&#43; Add Task</AddCard>
            )}
        </FormContainer>
    );
}

export default CreateTask;