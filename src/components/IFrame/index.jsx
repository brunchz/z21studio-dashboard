import React from 'react';

import { useFormatMessage } from 'hooks';



const IFrame = (name, biReports) => {
  let iframe = "";

  if (name === 'meta') {
    iframe = <iframe style={{ width: "95%", height: "100vh" }} title={useFormatMessage(name)} src={biReports.metaReport} />;
  } else if (name === 'shopify') {
    iframe = <iframe style={{ width: "95%", height: "100vh" }} title={useFormatMessage(name)} src={biReports.shopifyReport} />;
  } else if (name === 'google') {
    iframe = <iframe style={{ width: "95%", height: "100vh" }} title={useFormatMessage(name)} src={biReports.googleReport} />;
  } else {
    iframe = "You don't have access to view this";
  }
  return (
    <>
      <section className="hero is-hero-bar">
        <div className="hero-body">
          <h1 className="title">{name === 'meta' && useFormatMessage('Report.meta') || name === 'shopify' && useFormatMessage('Report.shopify') || name === 'google' && useFormatMessage('Report.google')}</h1>
        </div>
      </section>
      <section className="section is-main-section">
        {name}
      </section>
    </>
    );
};

export default IFrame;
