import React from 'react';
import { useSelector, shallowEqual, } from 'react-redux';
import { useFormatMessage } from 'hooks';
import { useParams, Redirect } from 'react-router-dom';
import paths from 'pages/Router/paths';


const Report = () => {

  const { name } = useParams();

  const { biReports } = useSelector(
    (state) => ({
      biReports: state.auth.userData.biReports
    }),
    shallowEqual
  );

  let iframe;

  if (name === 'meta'&& biReports.metaReport) {
    iframe = <iframe style={{ width: "95%", height: "100vh" }} title={useFormatMessage(name)} src={biReports.metaReport} />;
  } else if (name === 'shopify' && biReports.shopifyReport) {
    iframe = <iframe style={{ width: "95%", height: "100vh" }} title={useFormatMessage(name)} src={biReports.shopifyReport} />;
  } else if (name === 'google' && biReports.googleReport) {
    iframe = <iframe style={{ width: "95%", height: "100vh" }} title={useFormatMessage(name)} src={biReports.googleReport} />;
  } else {
    iframe = "You don't have a subcription to this report.";
  }
  
  const redirect = (name !== 'meta' && name !== 'shopify' && name !== 'google') && (
    <Redirect to={paths.ROOT} />
  );

  return (
    <>
      {redirect}
      <section className="hero is-hero-bar">
        <div className="hero-body">
          <h1 className="title">{name === 'meta' && useFormatMessage('Report.meta') || name === 'shopify' && useFormatMessage('Report.shopify') || name === 'google' && useFormatMessage('Report.google')}</h1>
        </div>
      </section>
      <section className="section is-main-section">
        {iframe}
      </section>
    </>
  );
};

export default Report;
