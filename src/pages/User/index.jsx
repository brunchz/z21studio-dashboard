import React, { useEffect, useMemo } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';
import * as yup from 'yup';

import UserForm from 'components/UserForm';
import { createUser, modifyUser, fetchUsers } from 'state/actions/users';
import paths from 'pages/Router/paths';
import { useFormatMessage } from 'hooks';
import AddPastReports from './AddPastReports';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  name: yup.string().required(),
  biReports: yup.object().shape({
    metaReport: yup.string().notRequired(),
    shopifyReport: yup.string().notRequired(),
  })
    .notRequired(),
  isAdmin: yup.boolean().notRequired(),
  location: yup.string().notRequired(),
  createdAt: yup.string().required(),
});

const User = () => {
  const { id } = useParams();

  const isEditing = useMemo(() => !!id, [id]);

  const { success, userData, error } = useSelector(
    (state) => ({
      success: state.users.success,
      userData: state.users.data.find((user) => user.id === id),
      error: state.users.error,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (isEditing) {
      if (!userData) {
        dispatch(fetchUsers(id));
      }
    }
  }, [isEditing, id, userData, dispatch]);

  const redirect = ((isEditing && error) || success) && (
    <Redirect to={paths.USERS} />
  );

  const editUserMessage = useFormatMessage('User.editUser');

  const newUserMessage = useFormatMessage('User.editUser');

  const onSubmitHandler = (value) => {
    const newUser = {
      ...value,
      file: value?.file[0] || null,
      isEditing,
      id,
    };

    if (isEditing) {
      dispatch(modifyUser(newUser));
    } else {
      dispatch(createUser(newUser));
    }
  };

  return (
    <>
      {redirect}
      <section className="hero is-hero-bar">
        <div className="hero-body">
          <h1 className="title">
            {isEditing ? editUserMessage : newUserMessage}
          </h1>
        </div>
      </section>
      <section className="section is-main-section">
        {isEditing && !userData ? (
          <ClipLoader className="cliploader-center" />
        ) : (
          <>
            <UserForm
              isEditing={isEditing}
              user={
                isEditing
                  ? userData
                  : {
                    name: '',
                    biReports: { 'metaReport': '', 'shopifyReport': '', 'googleReport': '' },
                    email: '',
                    location: '',
                    createdAt: new Date().toDateString(),
                    isAdmin: false,
                  }
              }
              onSubmitHandler={onSubmitHandler}
              schema={schema}
            />
            {isEditing && (
              <AddPastReports
                id={id}
                user={userData}
              />
            )
            }
          </>
        )}
      </section>
    </>
  );
};

export default User;
