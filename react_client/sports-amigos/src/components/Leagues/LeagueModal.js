import { useState, useEffect } from "react";
import "../../styles/leagues.css";
import axios from "axios";

export default function LeagueModal({ leagueModalToggle, leagueId }) {
  const [league, setLeague] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3100/api/league/" + leagueId)
      .then((res) => {
        setLeague(res.data);
        //debug
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  }, [leagueId]);

  const hideModal = () => {
    leagueModalToggle(false);
  };

  return (
    <>
      <div className="league-modal">
        <div onClick={hideModal} className="overlay">
          <div className="league-modal-content">
            <p>MY LEAGUE</p>
            <table>
              <thead>
                <tr>
                  <th> Name</th>
                  <th> Avatar </th>
                  <th> Last Name </th>
                  <th> Program </th>
                  <th> Email </th>
                  <th> Address </th>
                  <th> City </th>
                  <th> Phone </th>
                  <th> </th>
                  <th> </th>
                </tr>
              </thead>
              <tr>
                <td>{league.user.fullName}</td>
                <td>{league.user.avatar}</td>
              </tr>
            </table>
            <button onClick={hideModal} className="close-modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
