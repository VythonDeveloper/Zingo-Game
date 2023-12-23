import React from 'react'
import './ConfirmModal.css'

const ConfirmModal = ({text1, text2, setFunc, confirmFunc}) => {
  return (
    <div className='modalContainer'>
        <div className='modalBox'>
            <h2>{text1}</h2>
            <p>{text2}</p>

            <div className='modalBtn'>
                <button onClick={() => {confirmFunc(); setFunc(false)}}>Yes</button>
                <button onClick={() => setFunc(false)}>No</button>
            </div>
        </div>
    </div>
  )
}

export default ConfirmModal