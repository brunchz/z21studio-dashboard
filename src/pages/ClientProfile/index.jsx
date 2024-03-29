import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useFormatMessage } from 'hooks';
import { getMonthsBetween } from 'utils';
import ContinuousServicesCard from 'components/ContinuousServicesCard';
import ProjectServicesCard from 'components/ProjectServicesCard';

const ClientProfile = () => {
  const { userData } = useSelector(
    (state) => ({
      userData: state.auth.userData,
    }),
    shallowEqual
  );

  const dateToday = new Date();
  const dateJoined = new Date(userData.createdAt);

  return (
    <>
      <section className="hero">
        <div className="hero-body">
          <h1 className="title">{useFormatMessage('Profile.profile')}</h1>
        </div>
      </section>
      <section className="section is-main-section">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="card tile is-child">
              <header className="card-header">
                <p className="card-header-title">
                  <span className="icon">
                    <i className="mdi mdi-account-edit default" />
                  </span>
                  {useFormatMessage('UserForm.userInfo')}
                </p>
              </header>
              <div className="card-content">
                {userData.logoUrl && (
                  <>
                    <div className="is-user-avatar image has-max-width is-aligned-center">
                      <img
                        className="user-avatar"
                        src={userData.logoUrl}
                        alt="User profile logo preview"
                      />
                    </div>
                    <hr />
                  </>
                )}
                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <p className="label">Email</p>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <p className='input is-static'>{userData.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <p className="label">Company</p>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <p className='input is-static'>{userData.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <p className="label">Contact</p>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <p className='input is-static'>{userData.contact}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <p className="label">Date Joined</p>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <p className="input is-static inline">{userData.createdAt} | {getMonthsBetween(dateJoined, dateToday)} Months</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='tile' style={{ display: "flex", flexDirection: "column" }}>
            <ContinuousServicesCard 
            title={useFormatMessage('ClientProfile.continuousServices')} 
            servicesObj={userData.services.continuous}
            />
            <ProjectServicesCard 
            title={useFormatMessage('ClientProfile.projectServices')}
            servicesObj={userData.services.projectBased}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ClientProfile;
