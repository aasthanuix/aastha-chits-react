import React, { useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FaArrowRight } from "react-icons/fa";
import plan1 from "../../assets/images/chit-plans/plan1.png";
import plan2 from "../../assets/images/chit-plans/plan2.png";
import plan3 from "../../assets/images/chit-plans/plan3.png";
import plan4 from "../../assets/images/chit-plans/plan4.png";
import plan5 from "../../assets/images/chit-plans/plan5.png";
import plan6 from "../../assets/images/chit-plans/plan6.png";
import plan7 from "../../assets/images/chit-plans/plan7.png";
import plan8 from "../../assets/images/chit-plans/plan8.png";
import plan9 from "../../assets/images/chit-plans/plan9.png";
import plan10 from "../../assets/images/chit-plans/plan10.png";
import plan11 from "../../assets/images/chit-plans/plan11.png";
import plan12 from "../../assets/images/chit-plans/plan12.png";
import plan13 from "../../assets/images/chit-plans/plan13.png";
import EnrollForm from "../Brochure/EnrollForm";

const filters = [
  "All",
  "Chits Scheme 1-20 Months",
  "Chits Scheme 1-25 Months",
  "Chits Scheme 1-30 Months",
  "Chits Scheme 1-40 Months",
];

const colorPalette = [
  "#1F618D", "#6C3483", "#117864", "#AF601A", "#7B241C",
  "#0E6251", "#4A235A", "#784212", "#154360", "#512E5F",
  "#1A5276", "#633974", "#186A3B"
];

const plans = [
  {
    name: "Silver",
    value: "₹1,00,000",
    subscription: "₹5,000/month",
    min: "₹5,000",
    max: "₹30,000",
    image: plan1,
    filter: "Chits Scheme 1-20 Months",
  },
  {
    name: "Lilly",
    value: "₹4,00,000",
    subscription: "₹20,000/month",
    min: "₹6,000",
    max: "₹1,20,000",
    image: plan2,
    filter: "Chits Scheme 1-20 Months",
  },
  {
    name: "Silver",
    value: "₹1,50,000",
    subscription: "₹6,000/month",
    min: "₹6,000",
    max: "₹45,000",
    image: plan3,
    filter: "Chits Scheme 1-25 Months",
  },
  {
    name: "Gold",
    value: "₹2,00,000",
    subscription: "₹8,000/month",
    min: "₹8,000",
    max: "₹60,000",
    image: plan8,
    filter: "Chits Scheme 1-25 Months",
  },
  {
    name: "Jasmine",
    value: "₹3,00,000",
    subscription: "₹12,000/month",
    min: "₹12,000",
    max: "₹90,000",
    image: plan5,
    filter: "Chits Scheme 1-25 Months",
  },
  {
    name: "Lilly",
    value: "₹4,00,000",
    subscription: "₹16,000/month",
    min: "₹16,000",
    max: "₹1,20,000",
    image: plan6,
    filter: "Chits Scheme 1-25 Months",
  },
  {
    name: "Diamond",
    value: "₹5,00,000",
    subscription: "₹20,000/month",
    min: "₹20,00",
    max: "₹1,50,000",
    image: plan7,
    filter: "Chits Scheme 1-25 Months",
  },
  {
    name: "Jasmin",
    value: "₹3,00,000",
    subscription: "₹10,000/month",
    min: "₹12,000",
    max: "₹90,000",
    image: plan4,
    filter: "Chits Scheme 1-30 Months",
  },
  {
    name: "MarriGold",
    value: "₹6,00,000",
    subscription: "₹20,000/month",
    min: "₹24,000",
    max: "₹1,80,000",
    image: plan9,
    filter: "Chits Scheme 1-30 Months",
  },
  {
    name: "Diamond",
    value: "₹5,00,000",
    subscription: "₹12,500/month",
    min: "₹20,000",
    max: "₹1,50,000",
    image: plan10,
    filter: "Chits Scheme 1-40 Months",
  },
  {
    name: "Suryakanthi",
    value: "₹8,00,000",
    subscription: "₹20,000/month",
    min: "₹32,000",
    max: "₹2,40,000",
    image: plan11,
    filter: "Chits Scheme 1-40 Months",
  },
  {
    name: "Platinum",
    value: "₹10,00,000",
    subscription: "₹25,000/month",
    min: "₹40,000",
    max: "₹3,00,000",
    image: plan12,
    filter: "Chits Scheme 1-40 Months",
  },
  {
    name: "Lotus",
    value: "₹20,00,000",
    subscription: "₹50,000/month",
    min: "₹80,000",
    max: "₹6,00,000",
    image: plan13,
    filter: "Chits Scheme 1-40 Months",
  },
];

const ChitSchemes = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const filteredPlans =
    activeFilter === "All"
      ? plans
      : plans.filter((plan) => plan.filter === activeFilter);

  const handleEnrollClick = (plan) => {
    setSelectedPlan(plan.name); // store only the name
    setShowModal(true);
  };

  return (
    <section className="section-area section-sp2 bg-light">
      <div className="chits-container container">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h2 className="text-primary heading-bx style1 title-head-sm  chits-section mb-0">Explore Chit Plans</h2>
          <a href="/chits-plans" className="btn view-all-btn d-flex text-white align-items-center">
            View All <span className="view-btn"><FaArrowRight size={16} style={{ marginLeft: "5px", top: -1}} /></span>
          </a>
        </div>

        <div className="filter-tabs d-flex gap-4 pb-2 mb-4 flex-wrap">
          {filters.map((filter, i) => (
            <button
              key={i}                            
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="row g-4">
          {filteredPlans.map((plan, index) => {
            const bgColor = colorPalette[index % colorPalette.length];

            return (
              <div
                className="col col-md-6 col-lg-4 col-xl-4 "
                key={index}
              >
                <div
                  className="chit-card shadow-sm text-center text-white"
                  style={{
                    backgroundColor: bgColor,
                    minHeight: "400px",
                    maxHeight: "auto",
                  }}
                >
                  {plan.image && (
                    <img
                      src={plan.image}
                      alt={plan.name}
                      className="card-img-top mb-3 "
                      style={{ maxHeight: "160px", objectFit: "cover" }}
                    />
                  )}
                  <div className="chit-card-body">
                    <h5 className="chit-title">{plan.name}</h5>
                    <p className="chit-amount"><span>{plan.value} /-</span></p>
                    <p className="chit-monthly-plan">
                      Monthly Subscription:
                      <strong>{plan.subscription}</strong> 
                      <Tippy
                          content={
                                    <>
                                      Minimum Bid: {plan.min}
                                      <br />
                                      Maximum Bid: {plan.max}
                                    </>
                                  }
                                  placement="top"
                                >
                        <span className="ms-2" style={{ cursor: 'pointer' }}>
                          <FontAwesomeIcon icon={faInfoCircle} style={{ color: 'white', cursor: 'pointer' }} />
                        </span>
                      </Tippy>

                    </p>
                    <button
                    onClick={() => handleEnrollClick(plan)}
                    className="enroll-btn btn btn-sm text-white"
                  >
                    Enroll Now
                  </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPlans.length === 0 && (
          <p className="text-center mt-4 text-muted">
            No plans available under this scheme.
          </p>
        )}
      </div>
       <EnrollForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedPlan={selectedPlan}
      />
    </section>
  );
};

export default ChitSchemes;
