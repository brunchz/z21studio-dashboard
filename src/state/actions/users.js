import { createAction } from 'redux-act';
import { toastr } from 'react-redux-toastr';

import { firebaseError } from 'utils';
import firebase from 'firebase.js';
import { checkUserData, AUTH_UPDATE_USER_DATA } from './auth';
import {
  fetchCollection,
  fetchDocument,
  createDocument,
  deleteDocument,
  updateDocument,
  addPastReport,
  removePastReport
} from '../api';

export const USERS_FETCH_DATA_INIT = createAction('USERS_FETCH_DATA_INIT');
export const USERS_FETCH_DATA_SUCCESS = createAction(
  'USERS_FETCH_DATA_SUCCESS'
);
export const USERS_FETCH_DATA_FAIL = createAction('USERS_FETCH_DATA_FAIL');

export const USERS_DELETE_USER_INIT = createAction('USERS_DELETE_USER_INIT');
export const USERS_DELETE_USER_SUCCESS = createAction(
  'USERS_DELETE_USER_SUCCESS'
);
export const USERS_DELETE_USER_FAIL = createAction('USERS_DELETE_USER_FAIL');

export const USERS_CREATE_USER_INIT = createAction('USERS_CREATE_USER_INIT');
export const USERS_CREATE_USER_SUCCESS = createAction(
  'USERS_CREATE_USER_SUCCESS'
);
export const USERS_CREATE_USER_FAIL = createAction('USERS_CREATE_USER_FAIL');

export const USERS_MODIFY_USER_INIT = createAction('USERS_MODIFY_USER_INIT');
export const USERS_MODIFY_USER_SUCCESS = createAction(
  'USERS_MODIFY_USER_SUCCESS'
);
export const USERS_MODIFY_USER_FAIL = createAction('USERS_MODIFY_USER_FAIL');

export const USERS_CLEAN_UP = createAction('USERS_CLEAN_UP');

export const USERS_CLEAR_DATA_LOGOUT = createAction('USERS_CLEAR_DATA_LOGOUT');

export const fetchUsers = (userId = '') => {
  return async (dispatch, getState) => {
    dispatch(checkUserData());

    dispatch(USERS_FETCH_DATA_INIT());

    if (userId) {
      let user;
      try {
        user = await fetchDocument('users', userId);
      } catch (error) {
        toastr.error('', error);
        return dispatch(USERS_FETCH_DATA_FAIL({ error }));
      }

      if (!user) {
        const errorMessage = 'User not available';
        toastr.error('', errorMessage);
        return dispatch(USERS_FETCH_DATA_FAIL({ error: errorMessage }));
      }

      const users = getState().users.data;
      users.push(user);

      return dispatch(
        USERS_FETCH_DATA_SUCCESS({
          data: users,
        })
      );
    }

    const { id } = getState().auth.userData;

    let users;

    try {
      users = await fetchCollection('users');
    } catch (error) {
      toastr.error('', error);
      return dispatch(USERS_FETCH_DATA_FAIL({ error }));
    }

    return dispatch(
      USERS_FETCH_DATA_SUCCESS({
        data: users.filter((user) => user.id !== id),
      })
    );
  };
};

const deleteLogo = (oldLogo) => {
  if (!oldLogo.includes('firebasestorage')) {
    return null;
  }
  const logoPath = oldLogo.split('users%2F').pop().split('?alt=media').shift();
  return firebase.storage().ref(`users/${logoPath}`).delete();
};

const deleteReportFile = (oldReport) => {
  if (!oldReport.includes('firebasestorage')) {
    return null;
  }
  const reportPath = oldReport.split('users%2F').pop().split('?alt=media').shift();
  return firebase.storage().ref(`users/${reportPath}`).delete();
};

export const deleteUser = (id) => {
  return async (dispatch, getState) => {
    dispatch(USERS_DELETE_USER_INIT());
    const { locale } = getState().preferences;
    const { logoUrl } = getState()
      .users.data.filter((user) => user.id === id)
      .pop();

    // Add logic to remove all reports from storage
    const deleteLogoTask = logoUrl ? deleteLogo(logoUrl) : null;
    const deleteUserTask = deleteDocument('users', id);

    try {
      await Promise.all([deleteLogoTask, deleteUserTask]);
    } catch (error) {
      const errorMessage = firebaseError(error.code, locale);
      toastr.error('', errorMessage);
      return dispatch(
        USERS_DELETE_USER_FAIL({
          error: errorMessage,
        })
      );
    }

    toastr.success('', 'The user was deleted.');
    return dispatch(USERS_DELETE_USER_SUCCESS({ id }));
  };
};

export const deletePastReport = (userData, id, reportObj, reportId) => {
  return async (dispatch, getState) => {
    dispatch(USERS_MODIFY_USER_INIT());
    const { locale } = getState().preferences;
    const deleteReportTask = reportObj ? deleteReportFile(reportObj.reportUrl) : null;
    const removeReportTask = removePastReport('users', id, reportId);
    
    try {
      await Promise.all([deleteReportTask, removeReportTask]);
    } catch (error) {
      const errorMessage = firebaseError(error.code, locale);
      toastr.error('', errorMessage);
      return dispatch(
        USERS_MODIFY_USER_FAIL({
          error: errorMessage,
        })
      );
    }

    toastr.success('', 'The report was deleted.');
    return dispatch(USERS_MODIFY_USER_SUCCESS({ user: userData, id }));
  };
};

export const clearUsersDataLogout = () => {
  return (dispatch) => {
    dispatch(USERS_CLEAR_DATA_LOGOUT());
  };
};

const uploadLogo = (uid, file) => {
  const storageRef = firebase.storage().ref();

  const fileExtension = file.name.split('.').pop();

  const fileName = `${uid}.${fileExtension}`;

  return storageRef.child(`users/${fileName}`).put(file);
};

const getLogoUrl = (uid, file) => {
  const fileExtension = file.name.split('.').pop();

  const bucketUrl = `${process.env.REACT_APP_FIRE_BASE_STORAGE_API}`;

  return `${bucketUrl}/o/users%2F${uid}_200x200.${fileExtension}?alt=media`;
};

const uploadReport = async (uid, file) => {
  const storageRef = firebase.storage().ref();

  const fileExtension = file.name.split('.').pop();

  const fileName = file.name.split('.')[0];

  return storageRef.child(`users/${uid}_${fileName}.${fileExtension}`).put(file);
};

const getReportUrl = (uid, file) => {
  const fileExtension = file.name.split('.').pop();

  const bucketUrl = `${process.env.REACT_APP_FIRE_BASE_STORAGE_API}`;

  const fileName = file.name.split('.')[0];

  return `${bucketUrl}/o/users%2F${uid}_${fileName}.${fileExtension}?alt=media`;
};

export const createUser = ({
  name,
  email,
  location,
  file,
  createdAt,
  isAdmin,
}) => {
  return async (dispatch, getState) => {
    dispatch(USERS_CREATE_USER_INIT());
    const { locale } = getState().preferences;

    let response;
    try {
      const createUserAuth = firebase
        .functions()
        .httpsCallable('httpsCreateUser');

      response = await createUserAuth({ email, isAdmin });
    } catch (error) {
      const errorMessage = firebaseError(error.message, locale);
      toastr.error('', errorMessage);
      return dispatch(
        USERS_CREATE_USER_FAIL({
          error: errorMessage,
        })
      );
    }

    const { uid } = response.data;
    const biReports = { 'metaReport': '', 'shopifyReport': '', 'googleReport': '' };
    const reportObj = null;
    let uploadLogoTask = null;
    let logoUrl = null;
    if (file) {
      logoUrl = getLogoUrl(uid, file);
      uploadLogoTask = uploadLogo(uid, file);
    }
    const userData = { name, biReports, email, location, logoUrl, createdAt, isAdmin, reportObj};

    const createUserDbTask = createDocument('users', uid, userData);

    const actionCodeSettings = {
      url: process.env.REACT_APP_LOGIN_PAGE_URL,
      handleCodeInApp: true,
    };

    const sendSignInLinkToEmailTask = firebase
      .auth()
      .sendSignInLinkToEmail(email, actionCodeSettings);

    try {
      await Promise.all([
        uploadLogoTask,
        createUserDbTask,
        sendSignInLinkToEmailTask,
      ]);
    } catch (error) {
      const errorMessage = firebaseError(error.code, locale);
      toastr.error('', errorMessage);
      return dispatch(
        USERS_CREATE_USER_FAIL({
          error: errorMessage,
        })
      );
    }

    toastr.success('', 'User created successfully');
    return dispatch(USERS_CREATE_USER_SUCCESS({ user: response.data }));
  };
};

export const modifyUser = ({
  name,
  biReports,
  location,
  isAdmin,
  file,
  createdAt,
  id,
  isEditing,
  isProfile,
}) => {
  return async (dispatch, getState) => {
    dispatch(USERS_MODIFY_USER_INIT());
    const { locale } = getState().preferences;
    const user = isProfile
      ? getState().auth.userData
      : getState().users.data.find((thisUser) => thisUser.id === id);
    const { logoUrl } = user;
    let deleteLogoTask;
    let uploadLogoTask;
    let newLogoUrl = null;

    if (file) {
      newLogoUrl = getLogoUrl(id, file);
      deleteLogoTask = logoUrl && deleteLogo(logoUrl);
      uploadLogoTask = uploadLogo(id, file);
    }
    
    const userData = {
      name,
      biReports: biReports ||  user.biReports,
      location,
      createdAt,
      isAdmin: isAdmin || user.isAdmin,
      logoUrl: newLogoUrl || user.logoUrl,
    };

    const updateUserDbTask = updateDocument('users', id, userData);

    try {
      await Promise.all([deleteLogoTask, uploadLogoTask, updateUserDbTask]);
    } catch (error) {
      const errorMessage = firebaseError(error.code, locale);
      toastr.error('', errorMessage);
      return dispatch(
        USERS_MODIFY_USER_FAIL({
          error: errorMessage,
        })
      );
    }

    const { uid } = firebase.auth().currentUser;

    if (id === uid) {
      dispatch(AUTH_UPDATE_USER_DATA({ ...userData, id }));
    }

    if (isProfile) {
      toastr.success('', 'Profile updated successfully');
    } else if (isEditing) {
      toastr.success('', 'User updated successfully');
    }

    return dispatch(USERS_MODIFY_USER_SUCCESS({ user: userData, id }));
  };
};

export const uploadPastReport = ({
  id,
  user,
  report,
  reportDate,
}) => {
  return async (dispatch, getState) => {
    dispatch(USERS_MODIFY_USER_INIT());
    const { locale } = getState().preferences;

    let uploadReportTask;
    let newReportUrl = null;
    if (report) {
      newReportUrl = getReportUrl(id, report);
      uploadReportTask = uploadReport(id, report);
    }
    const reportData = { 
      reportUrl: newReportUrl, 
      reportDate
    };
    const addPastReportTask = addPastReport('users', id, reportData);

    try {
      await Promise.all([uploadReportTask, addPastReportTask]);
    } catch (error) {
      const errorMessage = firebaseError(error.code, locale);
      toastr.error('', errorMessage);
      return dispatch(
        USERS_MODIFY_USER_FAIL({
          error: errorMessage,
        })
      );
    }
    const { uid } = firebase.auth().currentUser;

    if (id === uid) {
      dispatch(AUTH_UPDATE_USER_DATA({ ...reportData, id }));
    }
    toastr.success('', 'Report uploaded successfully');

    return dispatch(USERS_MODIFY_USER_SUCCESS({ user, id }));
  };
};
export const usersCleanUp = () => (dispatch) => dispatch(USERS_CLEAN_UP());
