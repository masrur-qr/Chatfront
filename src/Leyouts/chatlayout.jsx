import React, { useRef } from 'react'
import '../App.css';

import menu from "../IMG/menu.png"
import avatar from "../IMG/avatar.png"


export default function Create({ name, id, socket, userid, imgurl, message }) {
    // ? ------------------ ENV
    var protocol = process.env.REACT_APP_PROTOC
    var Ip = process.env.REACT_APP_IP
    // ! ---------------
    var cookieData = document.cookie.split("=")[1].split(":")
    // ? make auto scrolling
    const ref = useRef()

    const scrollToLastFruit = () => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    console.log(message);
    const SendMessage = evt => {
        evt.preventDefault()
        var json = {
            type: "message",
            reciverid: id,
            userid: userid,
            text: evt.target[0].value,
        }
        if (evt.target[0].value !== "") {
            evt.target[0].value = ""
            socket.current.send(JSON.stringify(json))

        } else if (evt.target[1].length != 0) {
            console.log(evt.target[1].length != 0);
            console.log(evt.target[1].value.length);
            console.log(evt.target[1].value);
            json.type = "file"

            var file = evt.target[1].files[0]

            var rawData = new ArrayBuffer();
            var reader = new FileReader();


            reader.loadend = function () {

            }

            reader.onload = function (e) {
                rawData = e.target.result;
                const combinedData = {
                    file: rawData,
                    json: JSON.stringify(json),
                };

                evt.target[1].value = ""
                socket.current.send(rawData)
                alert("the File has been transferred.")
            }

            reader.readAsArrayBuffer(file);

        }
    }
    var messItem = message.map((item) =>
        <div key={item.MessageId} className={cookieData[2] === item.UserId ? "messageCon" : "messageConStart"}>
            {/* <p className='Messagetext' >{item.Text}{scrollToLastFruit()}</p> */}
            {item.type === "file" ?
                <a href={protocol+Ip+"/static/" + item.Text} className='Messagetext' >
                    {/* {item.Text} */}
                    <img src={protocol+Ip+"/static/" + item.Text} alt="" className='fileDisplay' />
                    {scrollToLastFruit()}
                </a>
                :
                <p className='Messagetext' >{item.Text}{scrollToLastFruit()}</p>}
        </div>
    )
    scrollToLastFruit()


    // ?----------------- Fron JS ----------------------
    const menuOpen = evt => {
        document.getElementById('containerOne').style.display = "flex"
    }
    return (
        <div className="containerTwo">
            <div className="conTwoHeader">
                <img src={imgurl !== "" ? protocol + Ip + "/static/upload/upload" + imgurl : avatar} alt="" className="useravatar" />
                <p className="userfullname">{name}</p>
                <img src={menu} alt="" className='menuicon' onClick={menuOpen} />
            </div>
            <div className="conTwoMain">
                {messItem}
                <div ref={ref} style={{ marginBottom: "5px" }}></div>
            </div>
            <div className="conTwoFooter">
                <form className='conTwoFooter' onSubmit={SendMessage}>
                    <input type="text" className='messageText' placeholder='Message' />
                    <div className="file-upload">
                        <input type="file" id='messageFileSend' name='img' className='messageFileSend' />
                    </div>
                    <label htmlFor="messageFileSend" className='FileLabel'>File</label>
                    {/* <input type="file" name="" id="" value="File" className='messageFileSend' /> */}
                    <input type="submit" value="Send" className='messageTextSend' />
                </form>
            </div>
        </div>
    )
}