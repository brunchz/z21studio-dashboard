import React, { useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { useFormatMessage } from 'hooks';
import paths from 'pages/Router/paths';
import NavLink from '../Link';
//  import classes from './Aside.module.scss';

export const SubMenu = ({ label, children }) => {
  const [active, setActive] = useState(false);

  return (
    <li className={classNames({ 'is-active': active })}>
      <a
        exact-active-class="is-active"
        className="has-icon has-dropdown-icon"
        onClick={() => setActive(!active)}
      >
        <span className="icon">
          <i className="mdi mdi-view-list" />
        </span>
        <span className="menu-item-label">{label}</span>
        <div className="dropdown-icon">
          <span className="icon">
            <i
              className={classNames(
                'mdi',
                { 'mdi-minus': active },
                { 'mdi-plus': !active }
              )}
            />
          </span>
        </div>
      </a>
      <ul>{children}</ul>
    </li>
  );
};

SubMenu.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};

const Aside = ({ handleMobileToggle }) => {
  const { isAdmin } = useSelector(
    (state) => ({
      isAdmin: state.auth.userData.isAdmin,
    }),
    shallowEqual
  );

  const usersMessage = useFormatMessage('Aside.users');

  return (
    <aside className="aside is-placed-left is-expanded">
      <Link to={paths.ROOT} className="aside-tools">
        <div className="aside-tools-label">
          <img style={{width:'100px',margin:'8px 8px'}}
                    src="https://uploads-ssl.webflow.com/60a3cf14fca52a5ff532af47/60a5a62513201d535a1ac0a4_Logo.svg"
                    alt="z21studio.com"
                  />
        </div>
      </Link>
      <div className="menu is-menu-main">
        <ul className="menu-list">
        {isAdmin && (
            <li>
              <NavLink
                to={paths.USERS}
                className="has-icon"
                onClick={handleMobileToggle}
              >
                <span className="icon">
                  <i className="mdi mdi-account-supervisor" />
                </span>
                <span className="menu-item-label">{usersMessage}</span>
              </NavLink>
            </li>
          )}
          {!isAdmin && (
          <li>
            <NavLink
              to="/report/meta"
              className="has-icon"
              onClick={handleMobileToggle}
            >
              <span className="icon">
                <i className="mdi mdi-facebook" />
              </span>
              <span className="menu-item-label">
                {useFormatMessage('Aside.meta')}
              </span>
            </NavLink>
          </li>
          )}
          {!isAdmin && (
            <li>
              <NavLink
                to="/report/shopify"
                className="has-icon"
                onClick={handleMobileToggle}
              >
                <span className="icon">
                  <i className="mdi mdi-shopify" />
                </span>
                <span className="menu-item-label">{useFormatMessage('Aside.shopify')}</span>
              </NavLink>
            </li>
          )}
          {!isAdmin && (
            <li>
              <NavLink
                to="/report/google"
                className="has-icon"
                onClick={handleMobileToggle}
              >
                <span className="icon">
                  <i className="mdi mdi-google" />
                </span>
                <span className="menu-item-label">{useFormatMessage('Aside.google')}</span>
              </NavLink>
            </li>
          )}
          {!isAdmin && (
            <li>
              <NavLink
                to={paths.PAST_REPORTS}
                className="has-icon"
                onClick={handleMobileToggle}
              >
                <span className="icon">
                  <i className="mdi mdi-file-document" />
                </span>
                <span className="menu-item-label">{useFormatMessage('Aside.pastReports')}</span>
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
};

Aside.propTypes = {
  handleMobileToggle: PropTypes.func.isRequired,
};

export default Aside;
