import React from 'react';
import "../styles.css";

const ProfilePage: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="profile-card mb-5">
        <div className="card bg-primary shadow-soft border-light">
          <div className="profile-image bg-primary shadow-inset border border-light rounded p-3 ml-3 mt-n5">
            <img
              src="../assets/placeholder.png"
              alt="Profile"
              className="card-img-top rounded"
            />
          </div>
          <div className="card-body">
            <h3 className="h5 mb-2">Ester</h3>
            <span className="h6 font-weight-normal text-gray mb-3">Lv. 6</span>
            <div className="friend-id-wrapper mb-3">
              <span className="friend-id-label">Friend ID:</span>
              <span className="friend-id">6842-5890-9482-5876</span>
            </div>
            <p className="status-message mb-3">Nice to meet you</p>
            <div className="emblems-wrapper">
              <h3 className="emblems-title">Emblems</h3>
              <div className="emblems-row d-flex">
                <div className="emblem-slot">+</div>
                <div className="emblem-slot">+</div>
                <div className="emblem-slot">+</div>
              </div>
              <div className="emblems-row d-flex">
                <div className="emblem-slot">+</div>
                <div className="emblem-slot">+</div>
                <div className="emblem-slot">+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
