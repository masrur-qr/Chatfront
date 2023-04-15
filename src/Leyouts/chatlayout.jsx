import React, { } from 'react'
import '../App.css';

import menu from "../IMG/menu.png"
// import avataractive from "../IMG/activeavatar.png"
import avatar from "../IMG/avatar.png"
import Ip from "../Data/Data"


// import Ip from "../Data/Data"


export default function Create({ name, id, socket, userid, imgurl,message }) {
    var cookieData = document.cookie.split("=")[1].split(":")

    console.log(message);
    const SendMessage = evt => {
        evt.preventDefault()
        if (evt.target[0].value !== "") {
            console.log("hello")
            var json = {
                type: "message",
                reciverid: id,
                userid: userid,
                text: evt.target[0].value,
            }
            evt.target[0].value = ""
            socket.current.send(JSON.stringify(json))
        }
    }
    var messItem = message.map((item) =>
        <div key={item.MessageId} className={cookieData[2] === item.UserId ? "messageCon" : "messageConStart"}>
            <p className='Messagetext'>{item.Text}</p>
        </div>
    )

    // ?----------------- Fron JS ----------------------
    const menuOpen = evt => {
        document.getElementById('containerOne').style.display = "flex"
    }
    return (
        <div className="containerTwo">
            <div className="conTwoHeader">
                <img src={imgurl !== "" ? "http://" + Ip + ":4500/static/upload/upload" + imgurl : avatar} alt="" className="useravatar" />
                <p className="userfullname">{name}</p>
                <img src={menu} alt="" className='menuicon' onClick={menuOpen} />
            </div>
            <div className="conTwoMain">
                {messItem}
                {/* <div className="messageCon">
                    <p className='Messagetext'>hi</p>
                </div>
                <div className="messageConStart">
                    <p className='Messagetext'>hi</p>
                </div>
                <div className="messageCon">
                    <p className='Messagetext'>hrferferfri</p>
                </div>
                <div className="messageConStart">
                    <p className='Messagetext'>hi</p>
                </div>
                <div className="messageCon">
                    <p className='Messagetext'>hiwwefeferrfr</p>
                </div> */}
            </div>
            <div className="conTwoFooter">
                <form className='conTwoFooter' onSubmit={SendMessage}>
                    <input type="text" className='messageText' placeholder='Message' />
                    <div className="file-upload">
                        <input type="file" id='messageFileSend' className='messageFileSend' />
                    </div>
                    <label htmlFor="messageFileSend" className='FileLabel'>File</label>
                    {/* <input type="file" name="" id="" value="File" className='messageFileSend' /> */}
                    <input type="submit" value="Send" className='messageTextSend' />
                </form>
            </div>
        </div>
    )
}