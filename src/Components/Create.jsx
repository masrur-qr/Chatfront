import React, { useState } from 'react'
import '../App.css';
import avatar from "../IMG/avatar.png"

console.log(document.cookie.split("=")[1]);
// coo
document.cookie = "hello " + document.cookie.split("=")[1]


export default function Create() {
    // ? ------------------ ENV
    var protocol = process.env.REACT_APP_PROTOC
    var Ip = process.env.REACT_APP_IP
    console.log(Ip,protocol);
    // ! ---------------
    const [PreviewImage, setPreviewImage] = useState(avatar);

    const change = evt => {
        console.log(evt);
        var url = URL.createObjectURL(evt.target.files[0])
        console.log(url);
        setPreviewImage(url)
    }

    const getId = evt => {
        evt.preventDefault()
        var datasend = JSON.stringify({
            "name": evt.target[0].value,
            "surname": evt.target[2].value,
            "login": evt.target[3].value,
            "lastname": evt.target[4].value,
            "password": evt.target[5].value
        });
        var data = new FormData();
        data.append("img", document.getElementById('AvatarUpload').files[0], "SafarCanvas.png");
        data.append("json", datasend)

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    console.log(this.responseText);
                    window.location.href = "/chat?" + document.cookie.split("=")[1]
                } else {
                    alert(JSON.parse(this.responseText).Code)
                    console.log("hello");
                }
            }
        });

        xhr.open("POST", protocol + Ip + "/create");

        xhr.send(data);
    }

    return (
        <div className="home__page">
            <form className="form" onSubmit={getId}>
                <p className="formCreateTitle">Create an Account</p>
                <div className='Inputs'>
                    <div>
                        <input type="text" id='Name' placeholder='Name' className='clientName' />
                        <div className='avatrfileselect'>
                            <img src={PreviewImage} alt="" />
                            <div className="AvatarUpload">
                                <input type="file" id='AvatarUpload' placeholder='' onChange={change} className='clientName clientNameavatar' />
                            </div>
                            <label htmlFor="AvatarUpload" className='clientName clientNameavatar'>Choose File</label>
                        </div>
                    </div>
                    <div>
                        <input type="text" id='Surname' placeholder='Surname' className='clientName' />
                        <input type="text" id='Login' placeholder='Login' className='clientName' />
                    </div>
                    <div>
                        <input type="text" id='Lastname' placeholder='Lastname' className='clientName' />
                        <input type="text" id='Password' placeholder='Password' className='clientName' />
                    </div>
                    {/* <button className='createFormClick' onClick={getId} id="">Submit</button> */}
                </div>
                <input type="submit" id="CreateSubmit" className='createFormClick' />
                <a href="/">Back to manu</a>
            </form>
        </div>
    )
}