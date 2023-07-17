import React, { useState } from 'react'
import TickIcon from './TickIcon'
import ProgressBar from './ProgressBar';
import Modal from './Modal';

const ListItem = ({task, getData}) => {

  const [showModal, setShowModal] = useState(false);

  const deleteItem = async()=>{
    try{
        const response = await fetch(`${process.env.REACT_APP_GOSERVER}/todos/${task.id}`, {
            method: "DELETE"
        })
        if(response.status===200)
        getData();
    }catch(err){
        console.log(err);
    }
  }

  return (
    <div className="list-item">
    <div className='info-container'>
    <TickIcon />
    <p className='task-title'>{task.title}</p>
    <ProgressBar />
    </div>
    <div className="button-container">
    <button className='edit' onClick={()=>setShowModal(true)}>EDIT</button>
    <button className='delete' onClick={deleteItem}>DELETE</button>
    </div>
    {showModal && <Modal mode={"edit"} setShowModal={setShowModal} task={task} getData={getData} />}
    </div>
  )
}

export default ListItem