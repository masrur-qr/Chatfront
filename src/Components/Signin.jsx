import React, { } from 'react'
import '../App.css';


export default function Create() {
    // ? ------------------ ENV
    var protocol = process.env.REACT_APP_PROTOC
    var Ip = process.env.REACT_APP_IP
    // ! ---------------
    const getId = evt => {
        evt.preventDefault()
        console.log(evt);
        // WARNING: For POST requests, body is set to null by browsers.
        var data = JSON.stringify({
            "login": evt.target[0].value,
            "password": evt.target[1].value
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                if (this.status === 200) {
                    console.log("passed");
                    // window.location.href = "/chat"
                } else {
                    console.log("notpassed");
                }
            }
        });

        xhr.open("POST", protocol + Ip + "/signin");
        xhr.send(data);

    }

    return (
        <div className="home__page">
            <form className="form" onSubmit={getId}>
                <p className="formCreateTitle">Sign In</p>
                <div className='InputsSignin'>
                    <div>
                        <input type="text" id='login' placeholder='Login' className='clientName' />
                        <input type="text" id='password' placeholder='Password' className='clientName' />
                    </div>
                    {/* <button className='createFormClick' onClick={getId} id="">Submit</button> */}
                </div>
                <input type="submit" id="CreateSubmit" className='createFormClick' />
                <a href="/">Back to manu</a>
            </form>
        </div>
    )
}