import React, { useEffect, useRef, useState } from 'react'
import '../App.css';
import avatar from "../IMG/avatar.png"
import exit from "../IMG/exit.png"
import x from "../IMG/x.png"
// import menu from "../IMG/menu.png"
import Ip from "../Data/Data"
import ChatScreen from "../Leyouts/chatlayout.jsx"




export default function Create() {
    // console.log("ti");
    // ! ------------------ Usesate declaretion -------------------
    const [userlist, setUserList] = useState([]);
    const [messagelist, setMessageList] = useState([]);
    const [notification, setNotification] = useState([]);

    const [requestSent, setRequestSent] = useState(false);
    const [userSelected, setuserSelected] = useState(false);
    const [connect, setConnect] = useState(false);

    const [curentUserId, setCurentUserId] = useState();
    const [curentUserName, setCurentUserName] = useState();
    const [curentimageurl, setCurentimageurl] = useState(avatar);

    const socket = useRef();
    const ref = useRef(null)
    var cookieData = document.cookie.split("=")[1].split(":")
    console.log(notification.length);

    useEffect(() => {
        if (connect == false) {
            // ? Make connection UseEffect is to prevent multiple request
            socket.current = new WebSocket("ws://" + Ip + "/ws")
            console.log("Connection to web Socket");
            // ? Open connection and send first Data
            socket.current.onopen = () => {
                console.log("connected succesfully");
                if (requestSent === false) {
                    var json = {
                        type: "list"
                    }
                    socket.current.send(JSON.stringify(json))
                    setRequestSent(true)
                }
            }
            setConnect(true)
        }
        // ? Listen close
        socket.current.onclose = (evt) => {
            console.log("connection closed", evt);
        }
        // ? Listen error
        socket.current.onerror = (err) => {
            console.log("error", err);
        }
        // ? Listen on message
        socket.current.onmessage = (msg) => {
            console.log(JSON.parse(msg.data));
            var messageResponse = JSON.parse(msg.data)
            if (messageResponse == null) {
                console.log("guy0");
            } else if (messageResponse[0].type == "message") {
                setMessageList(messageResponse)
            } else if (messageResponse[0].type === "list") {
                setUserList(messageResponse)
            } else if (messageResponse[0].type === "notification") {
                setNotification(messageResponse)
            }
        }
        // ! ======================== Display notification on board ==================
        if (notification.length > 0) {
            for (let index = 0; index < notification.length; index++) {
                if (document.getElementById(`${notification[index].UserId}`) !== null) {
                    console.log(userSelected);
                    if (document.getElementById(`${notification[index].UserId}`).style.display === "") {
                        document.getElementById(`${notification[index].UserId}`).style.display = "block"
                    }
                }
            }
        }
    });
    // ! ====================== User click listener =======================

    const Userselect = (id, name, imgurl) => {
        console.log(id);
        setuserSelected(true)
        setCurentUserId(id)
        setCurentUserName(name)
        setMessageList([])
        setCurentimageurl(imgurl)

        // ? on user click open chat wit this person (get all messages with this person)
        var json = {
            type: "chatwith",
            reciverid: id
        }
        socket.current.send(JSON.stringify(json))
        if (document.getElementById(`${id}`).style.display === "block") {
            console.log(document.getElementById(`${id}`).style.display);
        }
    }
    // ? ====================== Map through the users arrey ===================

    var ULmap = userlist.map((item) =>
        <li key={item.id} onClick={() => Userselect(item.id, item.name, item.imgurl)} className={item.id == cookieData[2] ? "display" : ""}>
            <img src={cookieData[4] != "" ? "http://" + Ip + ":4500/static/upload/upload" + item.imgurl : avatar} alt="" className="useravatar" />
            <p className="userfullname">{item.name}</p>
            <p className='note' id={item.id} ref={ref}>{notification.length}</p>
        </li>
    )

    // var uselistmap = userlist.m
    // ?----------------- Fron JS ----------------------
    const menuOpen = evt => {
        document.getElementById('containerOne').style.display = "flex"
    }
    const menuClose = evt => {
        document.getElementById('containerOne').style.display = "none"
    }
    // console.log("http://" + Ip + ":4500/static/upload/upload" + cookieData[4]);
    return (
        <div className="ChatPage">
            <div className="containerOne" id='containerOne'>
                <div className="conOneHeader">
                    <img src={cookieData[4] != "" ? "http://" + Ip + ":4500/static/upload/upload" + cookieData[4] : avatar} alt="" className="avatarimg" />
                    <p className="fullname">{cookieData[0] + " " + cookieData[1]}</p>
                    <img src={x} alt="" id='close' className='close' onClick={menuClose} />
                </div>
                <div className="conOneMain">
                    <p className="userlist">User list</p>
                    <ul>
                        {ULmap}
                    </ul>
                </div>
                <div className="conOneFooter">
                    <a href="/">
                        <img src={exit} alt="" className='exit' />
                    </a>
                </div>
            </div>
            {userSelected ?
                <ChatScreen name={curentUserName} id={curentUserId} socket={socket} userid={cookieData[2]} imgurl={curentimageurl} message={messagelist} />
                :
                <div className="containerTwo">
                    <h1>Welcome to Chat</h1>
                </div>
            }

        </div>
    )
}