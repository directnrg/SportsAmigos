import React, { useState, useEffect } from "react";
import LeagueModal from "./LeagueModal";
import axios from "axios";

export default function MyLeagues() {
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [leaguesList, setleagueList] = useState([]);

  useEffect(
    () => {
      axios
        .get("http://localhost:3100/api/leagues/")
      .then((res) => {
        setleagueList(res.data);
        //debug
        console.log(res.data);
      })
      .catch((err) => console.error(err))
    }
    , []);

  const sampleLeagueList = {
    _id: "60a43c5a5f93ec5c5bb5d5fe",
    users: ["60a43c5a5f93ec5c5bb5d5ff", "60a43c5a5f93ec5c5bb5d600"],
    guesses: [
      "60a43c5a5f93ec5c5bb5d601",
      "60a43c5a5f93ec5c5bb5d602",
      "60a43c5a5f93ec5c5bb5d603",
    ],
    games: ["60a43c5a5f93ec5c5bb5d604", "60a43c5a5f93ec5c5bb5d605"],
  };

  //toggle function
  const toggleLeagueModal = () => {
    setShowLeagueModal(!showLeagueModal);
  };

  return (
    <>
      <div>MyLeagues</div>
      {/**TODO - button should be per league */}
      {sampleLeagueList.length > 0 && (
        sampleLeagueList.map((league) => (
          <div key={league._id}>
            <button onClick={toggleLeagueModal}>Details</button>
            {showLeagueModal && (
              <LeagueModal
                leagueModalToggle={setShowLeagueModal}
                leagueId={league._id}
              />
            )}
          </div>
        )))}
    </>
  );
}
