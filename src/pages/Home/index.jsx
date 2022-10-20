import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Redirect } from 'react-router-dom';
import paths from 'pages/Router/paths';

import { useFormatMessage } from 'hooks';

const Home = () => {

  const { isAdmin } = useSelector(
    (state) => ({
      isAdmin: state.auth.userData.isAdmin
    }),
    shallowEqual
  );
  const redirect = isAdmin ? <Redirect to={paths.USERS} /> : <Redirect to='/report/meta' />;
  return (
  <>
  {redirect}
    <section className="hero is-hero-bar">
      <div className="hero-body">
        <h1 className="title">{useFormatMessage('Home.home')}</h1>
      </div>
    </section>

    <section className="section is-main-section">
      {useFormatMessage('Home.content')}
    </section>
  </>
  );
};

export default Home;
