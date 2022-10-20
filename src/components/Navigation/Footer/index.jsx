import React from 'react';
import classNames from 'classnames';

import classes from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className={classNames('level', classes.level)}>
          <div className="level-left">
            <div className="level-item">
              © 2022 <span>&nbsp;Z21STUDIO SDN BHD</span>
            </div>
          </div>
          <div className={classNames('level-right', classes.levelRight)}>
            <div className="level-item">
              <div className="logo">
                <a href="https://z21studio.com">
                  <img style={{width:'60px'}}
                    src="https://uploads-ssl.webflow.com/60a3cf14fca52a5ff532af47/60a5a62513201d535a1ac0a4_Logo.svg"
                    alt="z21studio.com"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
