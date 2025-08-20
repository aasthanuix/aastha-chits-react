import React, { useState, useEffect } from "react";
import "./Auctions.css";
import { io } from "socket.io-client";

const Auctions = ({ url }) => {
  const [chitPlans, setChitPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auctionForm, setAuctionForm] = useState({
    chitPlan: "",
    startingAmount: "",
    auctionDate: "",
  });
  const [activeAuction, setActiveAuction] = useState(null);
  const [pastAuctions, setPastAuctions] = useState([]);
  const [planUsers, setPlanUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [modalAmount, setModalAmount] = useState("");
  const [modalBidder, setModalBidder] = useState("");

  const token = localStorage.getItem("token");

  // ----- Fetch Plan Users -----
  const fetchPlanUsers = async (chitPlanId) => {
    try {
      const res = await fetch(`${url}/api/chit-plans/${chitPlanId}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data?.success && Array.isArray(data.users)) {
        setPlanUsers(data.users);
      } else {
        setPlanUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setPlanUsers([]);
    }
  };

  // ----- Fetch Auctions -----
  const fetchAuctions = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${url}/api/auctions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        const active = data.find((a) => a.status === "live") || null;
        const past = data.filter((a) => a.status !== "live");
        setActiveAuction(active);
        setPastAuctions(past);

        // Fetch users for active auction
        if (active?.chitPlanId) fetchPlanUsers(active.chitPlanId);
      }
    } catch (err) {
      console.error("Error fetching auctions", err);
    }
  };

  // ----- Setup socket -----
  useEffect(() => {
    if (!url || !token) return;
    const newSocket = io(url, { auth: { token } });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [url, token]);

  // ----- Socket listeners -----
  useEffect(() => {
    if (!socket) return;

    const handleNewAuction = (auction) => {
      setActiveAuction(auction);
      if (auction?.chitPlanId) fetchPlanUsers(auction.chitPlanId);
    };

    const handleAuctionUpdated = (auction) => {
      setActiveAuction(auction);
      if (auction?.chitPlanId) fetchPlanUsers(auction.chitPlanId);
    };

    const handleAuctionEnded = (auction) => {
      setActiveAuction(null);
      setPastAuctions((prev) => [auction, ...prev]);
      setPlanUsers([]);
    };

    socket.on("newAuction", handleNewAuction);
    socket.on("auctionUpdated", handleAuctionUpdated);
    socket.on("auctionEnded", handleAuctionEnded);

    return () => {
      socket.off("newAuction", handleNewAuction);
      socket.off("auctionUpdated", handleAuctionUpdated);
      socket.off("auctionEnded", handleAuctionEnded);
    };
  }, [socket, url, token]);

  // ----- Fetch chit plans on mount -----
  useEffect(() => {
    if (!url) return;
    fetch(`${url}/api/chit-plans`)
      .then((res) => res.json())
      .then((data) => setChitPlans(data))
      .catch(console.error)
      .finally(() => setLoading(false));

    fetchAuctions();
  }, [url]);

  // ----- Form handlers -----
  const handleChange = (e) =>
    setAuctionForm({ ...auctionForm, [e.target.name]: e.target.value });

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    if (!token) return alert("Admin token missing");

    const startingAmountNum = Number(auctionForm.startingAmount);
    const auctionDateObj = new Date(auctionForm.auctionDate);

    if (isNaN(startingAmountNum) || startingAmountNum <= 0)
      return alert("Starting amount must be positive");
    if (isNaN(auctionDateObj.getTime())) return alert("Invalid auction date");

    try {
      const res = await fetch(`${url}/api/auctions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chitPlanId: auctionForm.chitPlan,
          startingAmount: startingAmountNum,
          auctionDate: auctionDateObj.toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);

      setAuctionForm({ chitPlan: "", startingAmount: "", auctionDate: "" });
      fetchAuctions();
    } catch (err) {
      alert("Failed to create auction");
    }
  };

  const openUpdateModal = () => {
    if (!activeAuction) return;
    setModalAmount(activeAuction.currentAmount);
    setModalBidder(activeAuction.highestBidder || "");
    setShowUpdateModal(true);
  };

const handleSaveUpdate = async () => {
  if (!modalAmount || isNaN(modalAmount)) return alert("Enter valid amount");
  if (!modalBidder) return alert("Select highest bidder");

  try {
    const res = await fetch(`${url}/api/auctions/${activeAuction._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentAmount: Number(modalAmount),
        highestBidder: modalBidder,
      }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message);

    // Map highestBidder fields for frontend
    const updatedAuction = {
      ...data,
      highestBidderName: planUsers.find(u => u._id === data.highestBidder)?.name || null,
      highestBidderEmail: planUsers.find(u => u._id === data.highestBidder)?.email || null,
    };

    setActiveAuction(updatedAuction);
    setShowUpdateModal(false);
  } catch (err) {
    console.error(err);
    alert("Failed to update auction");
  }
};

  const handleEndAuction = async () => {
    if (!activeAuction) return alert("No active auction to end");
    try {
      const res = await fetch(`${url}/api/auctions/${activeAuction._id}/end`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message);

      setActiveAuction(null);
      setPastAuctions((prev) => [data, ...prev]);
      setPlanUsers([]);
    } catch (err) {
      alert("Error ending auction");
    }
  };

  return (
    <div className="auctions-container">
      <h1 className="title">Auction Management</h1>

      {/* Create Auction */}
      <section className="createSection">
        <h2>Create New Auction</h2>
        {loading ? (
          <p>Loading chit plans...</p>
        ) : (
          <form className="form" onSubmit={handleCreateAuction}>
            <label>
              Chit Plan
              <select
                name="chitPlan"
                value={auctionForm.chitPlan}
                onChange={handleChange}
                required
                disabled={!!activeAuction}
                className="select"
              >
                <option value="">Select Plan</option>
                {chitPlans.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.planName} — ₹{plan.totalAmount} ({plan.duration} months)
                  </option>
                ))}
              </select>
            </label>

            <label>
              Starting Amount
              <input
                type="number"
                name="startingAmount"
                value={auctionForm.startingAmount}
                onChange={handleChange}
                min="0"
                required
                disabled={!!activeAuction}
                className="input"
                placeholder="₹0"
              />
            </label>

            <label>
              Auction Date & Time
              <input
                type="datetime-local"
                name="auctionDate"
                value={auctionForm.auctionDate}
                onChange={handleChange}
                required
                disabled={!!activeAuction}
                className="input"
              />
            </label>

            <button type="submit" className="createBtn" disabled={!!activeAuction}>
              Create Auction
            </button>
            {activeAuction && (
              <p className="warning">
                Please end the current auction before creating a new one.
              </p>
            )}
          </form>
        )}
      </section>

      {/* Active Auction */}
      {activeAuction && (
        <section className="activeAuction">
          <h2>Active Auction</h2>
          <div className="auctionCard">
            <p>
              <strong>Plan:</strong> {activeAuction.chitPlanName}
            </p>
            <p>
              <strong>Current Amount:</strong> ₹{activeAuction.currentAmount}
            </p>
            <p>
              <strong>Highest Bidder:</strong>{" "}
              {activeAuction.highestBidderName || "N/A"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(activeAuction.auctionDate).toLocaleString()}
            </p>
            <div className="actionButtons">
              <button className="updateBtn" onClick={openUpdateModal}>
                Update Amount/Bidder
              </button>
              <button className="endBtn" onClick={handleEndAuction}>
                End Auction
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="modalOverlay">
          <div className="modal">
            <h3>Update Auction</h3>
            <label>
              Current Amount:
              <input
                type="number"
                value={modalAmount}
                onChange={(e) => setModalAmount(e.target.value)}
                className="input"
              />
            </label>
            <label>
              Highest Bidder:
              <select
                value={modalBidder}
                onChange={(e) => setModalBidder(e.target.value)}
                className="input"
              >
                <option value="">Select Bidder</option>
                {Array.isArray(planUsers) &&
                  planUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>
            </label>
            <div className="modalButtons">
              <button onClick={handleSaveUpdate} className="saveBtn">
                Save
              </button>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="cancelBtn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Past Auctions */}
      <section className="pastAuctions">
        <h2>Past Auctions</h2>
        {pastAuctions.length === 0 ? (
          <p>No past auctions yet.</p>
        ) : (
          <table className="auctionTable">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Final Amount</th>
                <th>Highest Bidder</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[...pastAuctions]
                .sort((a, b) => new Date(b.auctionDate) - new Date(a.auctionDate))
                .map((auc) => (
                  <tr key={auc._id} className="fadeIn">
                    <td>{auc.chitPlanName}</td>
                    <td>₹{auc.currentAmount}</td>
                    <td>
                      {auc.highestBidderName
                        ? `${auc.highestBidderName} (${auc.highestBidderEmail})`
                        : "N/A"}
                    </td>
                    <td>{new Date(auc.auctionDate).toLocaleString()}</td>
                    <td>{auc.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default Auctions;
