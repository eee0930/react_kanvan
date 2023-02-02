import { motion } from "framer-motion";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

const TrashContainer = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    top: 20px;
    left: 20px;
    text-align: center;
    &:hover div {
        opacity: 1;
    }
`;
const Trash = styled(motion.svg)`
    width: 30px;
    height: 30px;
`;
const Message = styled.div`
    opacity: 0;
    position: absolute;
    top: -15px;
    left: 0;
    width: 135px;
    color: #172b4d;
    font-size: 12px;
    font-weight: 500;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
    padding: 3px;
    transition: opacity 0.3s ease;
`;

const trashVariants = {
    initial: {
        fill: "rgba(255, 255, 255, 1)",
    },
    hover: {
        fill: "rgba(249, 152, 152, 1)",
    },
};


function TaskTrash() {
    return <div>
        <Droppable droppableId="trash">
            {(magic) => (<>
                <TrashContainer 
                    ref={magic.innerRef} 
                    {...magic.droppableProps} >
                    <Trash 
                        variants={trashVariants}
                        initial="initial"
                        whileHover="hover"
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 448 512">
                        <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 
                            32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 
                            64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 
                            16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
                    </Trash>
                    <Message>Drag here task to delete</Message>
                </TrashContainer>
            </>)}
        </Droppable>
    </div>;
};

export default TaskTrash;