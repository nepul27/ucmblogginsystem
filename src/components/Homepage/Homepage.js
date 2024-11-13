import React from 'react'
import './homepage.css'
import doubt from './doubt.png';
import { NavLink } from 'react-router-dom';
var margin = {
    marginTop: "80px",
}

var color1 = {
    backgroundColor: 'white',
    height: '100vh',
}

function Homepage() {
    return (
        <>
            <header Style="height:100%; margin-top:20vh; z-index:1; background-color:white">
                <div className="container mt-5 text-center">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-xs-12 mx-4">
                            <div className="contents">
                                <h2 className="head-title">University Blogging made easy!</h2>
                                <p>Find the best answers to your questions and help others answer theirs. Blogger is a university-based community space to find and contribute answers to questions.</p>
                            </div>
                            <div className="text-left">
                                <NavLink to="/questions" className="btn btn-primary started-btn">Get Started</NavLink>
                            </div>
                        </div>

                        <div className="col-lg-5 col-md-12 col-xs-12 mx-3">
                            <div className="intro-img">
                                <img src={doubt} alt="Not Loaded" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <footer className="text-center text-lg-start" Style="background-color: #4e63d7; position:absolute; bottom:0vh;width:100%;">
                <div className="text-center text-white p-3" Style="background-color: rgba(0, 0, 0, 0.2);">
                    © 2023 UCM-Blogger
                </div>
            </footer>
        </>
    );
}

export default Homepage