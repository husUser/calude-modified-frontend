import React from "react";
import { LuLampDesk } from "react-icons/lu";
import { GrTechnology } from "react-icons/gr";
import { FaKey } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { MdEnergySavingsLeaf } from "react-icons/md";
import { GiSatelliteCommunication } from "react-icons/gi";
import { IoInformationCircle } from "react-icons/io5";
import { LuTrainTrack } from "react-icons/lu";
import "./AboutPage.css";

const About = () => {
  return (
    <section className="about-container">
      {/* Enhanced animated heading */}
      <div className="heading-wrapper">
        <h1 className="main-heading">
          <span className="heading-accent"> About The Portal</span>
        </h1>
        <div className="heading-underline"></div>
      </div>

      {/* Main content card */}
      <div className="content-card">
        {/* Inspiration section */}
        <div className="section-wrapper">
          <div className="section-header">
            <div className="icon-wrapper">
              <LuLampDesk color="white" />
            </div>
            <h2 className="section-title">Inspiration</h2>
          </div>
          <p className="content-text highlight-first">
            The inspiration behind this booking app came from the frequent need
            for students to visit professors to obtain paper signatures before
            accessing laboratory equipment, as well as the constant calls and
            requests to equipment operators regarding sample status and other
            queries. Additionally, the previous Excel-based booking system was
            vulnerable to accidental or unauthorized modifications. This app
            streamlines the entire process by simplifying equipment booking,
            improving communication, and providing better access to information.
            Ultimately, it helps save time, cost, energy, and effort for
            students, equipment operators, and professors alike.
          </p>
        </div>

        {/* Technology section */}
        <div className="section-wrapper">
          <div className="section-header">
            <div className="icon-wrapper">
              <GrTechnology color="white" />
            </div>
            <h2 className="section-title">Technology Stack</h2>
          </div>
          <p className="content-text">
            The front-end of the application is built with{" "}
            <span className="tech-tag react-tag">React</span>, while the
            back-end leverages the{" "}
            <span className="tech-tag express-tag">Express</span> framework.
            These technologies are trusted by leading companies like{" "}
            <span className="company-highlight">Facebook</span>,{" "}
            <span className="company-highlight">Instagram</span>,{" "}
            <span className="company-highlight">Airbnb</span>, and{" "}
            <span className="company-highlight">Netflix</span> ensuring
            performance, scalability, and modern design.
          </p>
        </div>

        {/* Benefits section */}
        <div className="section-wrapper">
          <div className="section-header">
            <div className="icon-wrapper">
              <FaKey color="white" />
            </div>
            <h2 className="section-title">Key Benefits</h2>
          </div>
          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="benefit-icon">
                <MdAccessTimeFilled color="white" />
              </span>
              <span className="benefit-text">Saves Time</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">
                <FaMoneyBill1Wave color="white" />
              </span>
              <span className="benefit-text">Reduces Costs</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">
                <MdEnergySavingsLeaf color="white" />
              </span>
              <span className="benefit-text">Saves Energy</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">
                <GiSatelliteCommunication color="white" />
              </span>
              <span className="benefit-text">Streamlines Communication</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">
                <IoInformationCircle color="white" />
              </span>
              <span className="benefit-text">Get equipment Information</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">
                <LuTrainTrack color="white" />
              </span>
              <span className="benefit-text">Track students activity</span>
            </div>
          </div>
        </div>

        {/* Quote section */}
        <div className="quote-section">
          <div className="quote-mark">"</div>
          <blockquote className="inspirational-quote">
            Simplicity is the ultimate sophistication
          </blockquote>
          <cite className="quote-author"> Leonardo da vinci</cite>
        </div>
      </div>
    </section>
  );
};

export default About;
