import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

const Modal = ({mode, setShowModal, getData, task}) => {

  const [cookies, setCookie, removeCookie] = useCookies(null);

  const editMode = mode==="edit" ? true : false;

  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.Email,
    title: editMode ? task.title : '',
    progress: editMode ? task.progress : 0,
    date: editMode ? task.date : new Date()
  });
  

  const postData = async (e)=>{
    e.preventDefault();
    console.log(process.env.REACT_APP_SERVERURL);
    try{
        const response = await fetch(`${process.env.REACT_APP_GOSERVER}/todos`, {
            method: "POST",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify(data)
        });
        console.log(response);
        setShowModal(false);
        getData();
    }catch(err){
        console.log(err);
    }
  }

  const editData = async (e)=>{
    e.preventDefault();
    console.log('edit');
    try{
        const response = await fetch(`${process.env.REACT_APP_GOSERVER}/todos/${task.id}`, {
            method: "PUT",
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify(data)
        });
        console.log(response);
        setShowModal(false);
        getData();
    }catch(err){
        console.log(err);
    }
  }

  const handleChange = (e) => {
    // console.log("Changing !");
    const {name, value} = e.target;

    setData((data)=>{
        return {
            ...data,
            [name] : value
        }
    })
  }

  return (
    <div className='overlay'>
    <div className='modal'>
    <div>
    <h3>Let's {mode} your task</h3>
    <button onClick={()=>setShowModal(false)}>X</button>
    </div>

    <form>
    <input
    required
    maxLength={30}
    placeholder = "Your task goes here"
    value={data.title}
    name="title"
    onChange = {handleChange}
    />
    <br/>
    <label htmlFor="range">
    Drag to select your current progress
    </label>
    <input
    required
    type="range"
    id="range"
    min="0"
    max="100"
    name="progress"
    value={data.progress}
    onChange = {handleChange}
    />
    <input className={mode} type="submit" onClick={editMode ? editData : postData}/>
    </form>
    </div>
    </div>
  )
}

export default Modal