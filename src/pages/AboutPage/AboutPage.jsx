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
import { MdRule } from "react-icons/md";
import {
  FaClipboardCheck,
  FaTag,
  FaListOl,
  FaHandshake,
  FaUserSlash,
  FaBan,
  FaCheckCircle,
  FaTrashAlt,
} from "react-icons/fa";
import { MdCalendarToday, MdWarningAmber, MdBlock } from "react-icons/md";
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
            This app simplifies the booking process, improves equipment
            availability and communication, and helps ensure fair access for
            all. Ultimately, the goal is to make the best use of the available
            analytical equipment while saving time, effort, and resources.
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

        {/* Rules section */}
        <div className="section-wrapper">
          <div className="section-header">
            <div className="icon-wrapper">
              <MdRule color="white" />
            </div>
            <h2 className="section-title">Booking Rules & Guidelines</h2>
          </div>
          <ol className="rules-list">
            <li className="rule-item">
              <span className="rule-icon">
                <FaClipboardCheck color="white" />
              </span>
              <span className="rule-text">
                Provide samples as per the specified specifications and slot
                timings.
              </span>
            </li>
            <li className="rule-item">
              <span className="rule-icon">
                <FaTag color="white" />
              </span>
              <span className="rule-text">
                When submitting your sample, make sure it is properly labeled
                with complete information, including your name, sample name, and
                booking ID.
              </span>
            </li>
            <li className="rule-item">
              <span className="rule-icon">
                <MdCalendarToday color="white" />
              </span>
              <span className="rule-text">
                Slot booking opens every Wednesday at 8:30 AM.
              </span>
            </li>
            <li className="rule-item">
              <span className="rule-icon">
                <FaListOl color="white" />
              </span>
              <span className="rule-text">
                For instruments that allow only one sample per day, the first
                row entry will be considered for that day. The same rule applies
                for two- or three-sample-per-day and other day-specific
                bookings.
              </span>
            </li>
            <li className="rule-item">
              <span className="rule-icon">
                <MdWarningAmber color="white" />
              </span>
              <span className="rule-text">
                For paper-related comments or emergency analysis that needs to
                be completed urgently, please approach the instrument in-charge
                with a guide-approved email and supporting evidence. Verbal
                requests will not be entertained.
              </span>
            </li>
            <li className="rule-item">
              <span className="rule-icon">
                <MdBlock color="white" />
              </span>
              <span className="rule-text">
                Depending on holidays, external sample bookings, or maintenance
                schedules, the slot booking column may be blocked. Please make
                sure not to book on holidays.
              </span>
            </li>
            <li className="rule-item">
              <span className="rule-icon">
                <FaHandshake color="white" />
              </span>
              <span className="rule-text">
                When writing your paper, make sure to properly acknowledge the
                respective sponsor of the equipment used. Full details are
                available in the Information section of the website.
              </span>
            </li>
            <li className="rule-item">
              <span className="rule-icon">
                <FaUserSlash color="white" />
              </span>
              <span className="rule-text">
                Booking for students outside the department is not allowed.
                External samples should go through the proper departmental
                guidelines as before.
              </span>
            </li>
            <li className="rule-item">
              <span className="rule-icon">
                <FaBan color="white" />
              </span>
              <span className="rule-text">
                Proxy booking on behalf of students from other labs to share
                slots is strictly prohibited and will lead to serious
                punishment. You are only allowed to book equipment for ongoing
                research work in your own lab; violations may result in
                punishment up to removal from the portal.
              </span>
            </li>
            <li className="rule-item">
              <span className="rule-icon">
                <FaCheckCircle color="white" />
              </span>
              <span className="rule-text">
                You can track your analysis completion status from your booking
                history table, and you should close the status ("Complete
                Booking") after receiving your sample and analysis data.
              </span>
            </li>
            <li className="rule-item">
              <span className="rule-icon">
                <FaTrashAlt color="white" />
              </span>
              <span className="rule-text">
                Data cleaning and sample disposal may be carried out depending
                on conditions, so make sure to collect your results and samples
                on time.
              </span>
            </li>
          </ol>
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
