import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const WrapperContainer = styled.div`
    display: inline-block;
    height: 100%;
    vertical-align: top;
    white-space: nowrap;
    width: 272px;
`;
const FormContainer = styled.div<IBackground>`
    width: 250px;
    border-radius: 3px;
    height: auto;
    min-height: 36px;
    padding: 4px;
    position: relative;
    background-color: ${props => props.backgroundColor};
    transition: background 0.3s ease-in-out;
    align-self: start;
    z-index: 100;
    &:hover {
        background-color: ${props => props.backgroundHover};
    }
`;
const DisplayButton = styled.button`
    width: 100%;
    height: 100%;
    border: none;
    background-color: transparent;
    border-radius: 3px;
    cursor: pointer;
    color: #172b4d;
    padding: 6px 8px;
`;
const Form = styled.form`
    width: 100%;
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
const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    z-index: 0;
`;

interface IBackground {
    backgroundColor: string;
    backgroundHover: string;
}

interface IBoard {
    boardName: string;
}

function CreateBoard() {
    const { register, handleSubmit, setValue, setFocus } = useForm();
    const [todoState, setToDoState] = useRecoilState(toDoState);
    
    const [isFormDisplay, setIsFormDisplay] = useState(false);
    const handleDisplayForm = () => {
        setIsFormDisplay(true);
        setFocus("boardName");
    };
    const cancelAdd = () => setIsFormDisplay(false);
    const onValid = ({ boardName }: IBoard) => {
        if(boardName in todoState) {
            alert("이미 존재하는 Board입니다!");
            setValue("boardName", "");
            return;
        }
        setToDoState((allBoards) => {
            return {
                ...allBoards,
                [boardName]: []
            }
        })
        setValue("boardName", "");
        setIsFormDisplay((current) => !current);
    };
    const handleOverlay = () => setIsFormDisplay(false);

    return (<>
        <WrapperContainer>
            {isFormDisplay && <Overlay onClick={handleOverlay}/>}
            <FormContainer 
                backgroundColor={isFormDisplay? "#ebecf0" : "rgba(0, 0, 0, 0.05)"}
                backgroundHover={isFormDisplay? "" : "rgba(0, 0, 0, 0.1)"}
            >
                {isFormDisplay? 
                    (<Form onSubmit={handleSubmit(onValid as any)}>
                        <BoardInput 
                            {...register("boardName", {required: true})}
                            type="text" 
                            placeholder="Enter Board Title :)" 
                        />
                        <BoardAddControl>
                            <AddButton>Add</AddButton>
                            <CancelButton onClick={cancelAdd}>&times;</CancelButton>
                        </BoardAddControl>
                    </Form>) :
                    (<DisplayButton onClick={handleDisplayForm}>
                        &#43; Add Another Board
                    </DisplayButton>)
                }
            </FormContainer>
        </WrapperContainer>
    </>);
}

export default CreateBoard;