import React from 'react'
import Createicon from "../IMG/Createicon.png"
import Signin from "../IMG/Signinicon.png"
import '../App.css';

//? Import Containers


export default function Home() {
    return (
        <div className="home__page">
            <a href='/create' className="optionOne">
                <img src={Createicon} alt="" className='icon' />
                <p className="Desc">
                    Create
                    <br />
                    Account
                </p>
            </a>
            <a href='/join' className="optionTwo">
                <img src={Signin} alt="" className='icon' />
                <p className="Desc">
                    Sign In
                </p>
            </a>
        </div>
    )
}