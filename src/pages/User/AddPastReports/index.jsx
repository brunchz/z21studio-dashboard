/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { usersCleanUp } from 'state/actions/users';
import PropTypes from 'prop-types';

//  import classNames from 'classnames';

import { useFormatMessage, useFormatDate } from 'hooks';
import DatePicker from 'components/DatePicker';

//  import ErrorMessage from 'components/ErrorMessage';

const AddPastReports = (isEditing, isProfile, user, onSubmitHandler, schema) => {
  const { reportObj, loading, success } = useSelector(
    (state) => ({
      reportObj: state.auth.userData.reportObj,
      loading: state.users.loading,
      success: state.users.success,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: { ...user, 'createdAt': '10-10-2022' },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (success) {
      setValue('report', null);
    }
    return () => dispatch(usersCleanUp());
  }, [dispatch, success, setValue]);


  const pickAnotherFileMessage = useFormatMessage('UserForm.pickAnotherFile');
  const pickFileMessage = useFormatMessage('UserForm.pickFile');

  return (
    <>
      <div className="tile is-ancestor">
        <div className="tile is-parent">

          <div className="card tile is-child">
            <header className="card-header">
              <p className="card-header-title">
                <span className="icon">
                  <i className="fa fa-lock" />
                </span>
                {useFormatMessage(`AddPastReports.title`)}
              </p>
            </header>
            <div className="card-content">
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <label className="label">
                      {useFormatMessage('UserForm.report')}
                    </label>
                  </div>
                  <div className="field is-horizontal">
                    <div className="file has-name">
                      <label className="file-label is-normal">
                        <input
                          className="file-input"
                          type="file"
                          name="report"
                          ref={register}
                          accept="application/pdf"
                        />
                        <span className="file-cta">
                          <span className="file-icon">
                            <i className="mdi mdi-upload" />
                          </span>
                          <span className="file-label">
                            {watch('report') && watch('report').file
                              ? pickAnotherFileMessage
                              : pickFileMessage}
                          </span>
                        </span>
                        <span className="file-name">
                          {watch('report') && watch('report')[0]?.name}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <label className="label">
                      {useFormatMessage('UserForm.created')}
                    </label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <Controller
                        control={control}
                        name="createdAt"
                        render={({ onChange, name, value }) => (
                          <DatePicker
                            name={name}
                            onChange={onChange}
                            date={new Date(value)}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="field is-horizontal">
                  <div className="field-label is-normal" />
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <button
                          type="submit"
                          className={`button is-primary ${loading && 'is-loading'}`}
                        >
                          {useFormatMessage(`ChangePassword.submits`)}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="tile is-parent preview">
          <div className="card tile is-child">
            <header className="card-header">
              <p className="card-header-title">
                <span className="icon">
                  <i className="mdi mdi-account default" />
                </span>
                {useFormatMessage('AddPastReports.reportsTable')}
              </p>
            </header>
            <div className="card-content">
              <div className="field">
                <label className="label">
                  {useFormatMessage('UserForm.created')}
                </label>
                <div className="control is-clearfix" data-testid="date">
                  <p className="date">
                    {useFormatDate(watch('createdAt'), {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  {Object.entries(reportObj).map(([key, value]) => {
                    return (
                      <div key={key}>
                        {key} = {value.reportDate}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
AddPastReports.propTypes = {
  report: PropTypes.shape({
    reportUrl: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
};

export default AddPastReports;
