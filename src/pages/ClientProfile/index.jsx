import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useFormatMessage } from 'hooks';

const ClientProfile = () => {
  const { userData } = useSelector(
    (state) => ({
      userData: state.auth.userData,
    }),
    shallowEqual
  );

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
              </div>
            </div>
          </div>

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
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ClientProfile;
