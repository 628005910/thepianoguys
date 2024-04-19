import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'

const Home = () => {
  return (
    <div id="body">

        <div id="main-content">
      
            <img id="logo-img2" src="pianoLogo.jpg" alt="Piano Logo" />

            <div id="mission-div">
                <h1 id="mission-header">Our Mission</h1>
                <p id="mission-description">At our core, we endeavor to offer an interactive platform tailored for individuals
                 seeking to delve into the realm of music education without the constraints of substantial resources. These 
                 constraints may encompass financial limitations, time constraints, or an absence of foundational knowledge in 
                 music theory. Our solution integrates the functionality of a standard computer keyboard with the intricacies of 
                 a piano, eliminating the necessity for supplementary hardware. Complementing this feature, our application 
                 extends comprehensive support through visual aids such as sheet music and instructional videos, facilitating a
                  holistic approach to instrumental learning.
                </p>
            </div>

            <Link to="/piano">
                <button id="piano-button">Get Started</button>
            </Link>
        </div>

    </div>
  );
};

export default Home;