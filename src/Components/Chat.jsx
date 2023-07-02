import React, { useEffect, useRef, useState } from 'react'
import '../App.css';
import avatar from "../IMG/avatar.png"
import exit from "../IMG/exit.png"
import x from "../IMG/x.png"
import ChatScreen from "../Leyouts/chatlayout.jsx"


export default function Create() {
    // ? ------------------ ENV
    var protocol = process.env.REACT_APP_PROTOC
    var webProtocol = process.env.REACT_APP_WEBPROTOC
    var Ip = process.env.REACT_APP_IP
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

    var imgOfUser = protocol + Ip + "/static/upload/upload" + cookieData[4].split(";")[0]

    function WebConnect() {
        // ? Make connection UseEffect is to prevent multiple request
        socket.current = new WebSocket(webProtocol + Ip + "/ws")
        socket.onbeforeopen = (event) => {
            // Add the necessary headers for WebSocket upgrade
            socket.setRequestHeader('Connection', 'Upgrade');
            socket.setRequestHeader('Upgrade', 'websocket');
        };
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
    useEffect(() => {
        if (connect === false) {
            WebConnect()
        }
        // ? Listen close
        socket.current.onclose = (evt) => {
            console.log("connection closed", evt);
            alert("Connectin closed. It would be reset after 30 sec")
            window.location.reload()
            setTimeout(() => {
                WebConnect()
                console.log("timer");
            }, 1000);
            console.log("Connecting again");
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
            } else if (messageResponse[0].type === "message" || messageResponse[0].type === "file" ) {
                setMessageList(messageResponse)
                console.log(messagelist);
            } else if (messageResponse[0].type === "list") {
                setUserList(messageResponse)
            } else if (messageResponse[0].type === "notification") {
                setNotification(messageResponse)
                console.log(notification);
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
    }, [connect, notification, requestSent, userSelected]);
    // ! ====================== User click listener =======================

    const Userselect = (id, name, imgurl) => {
        console.log(messagelist);

        console.log(id);
        setuserSelected(true)
        setCurentUserId(id)
        setCurentUserName(name)
        setMessageList([])
        setCurentimageurl(imgurl)
        console.log(messagelist);

        // ? on user click open chat wit this person (get all messages with this person)
        var json = {
            type: "chatwith",
            reciverid: id
        }
        socket.current.send(JSON.stringify(json))
        // if (document.getElementById(`${id}`).style.display === "block") {
        //     console.log(document.getElementById(`${id}`).style.display);
        // }
        // document.getElementById(`${id}`).style.display = "none"
    }
    // ? ====================== Map through the users arrey ===================


    var ULmap = userlist.map((item) =>
        <li key={item.id} onClick={() => Userselect(item.id, item.name, item.imgurl)} className={item.id === cookieData[2] ? "display" : ""}>
            <img src={cookieData[4] !== "" ? protocol + Ip + "/static/upload/upload" + item.imgurl : avatar} alt="" className="useravatar" />
            <p className="userfullname">{item.name}</p>

            {
                notification.map((itemNote) =>
                    <p className={item.id === itemNote.userid ? "noteadd" : "note"} key={itemNote.UserId} id={item.id === itemNote.userid ? item.id : ""} ref={ref}>{item.id !== itemNote.userid ? "" : itemNote.amount}</p>
                    // <p className="noteadd" key={itemNote.UserId} id={item.id} ref={ref}>{item.id !== itemNote.userid ? "" : itemNote.amount}</p>
                )
            }
        </li>
    )

    // ?----------------- Fron JS ----------------------
    const menuClose = evt => {
        document.getElementById('containerOne').style.display = "none"
    }
    return (
        <div className="ChatPage">
            <div className="containerOne" id='containerOne'>
                <div className="conOneHeader">
                    <img src={cookieData[4] !== "" ? imgOfUser : avatar} alt="" className="avatarimg" />
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