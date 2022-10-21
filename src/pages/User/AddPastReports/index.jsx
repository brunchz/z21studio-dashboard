/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { usersCleanUp, uploadPastReport } from 'state/actions/users';
import * as yup from 'yup';
import classNames from 'classnames';
import ErrorMessage from 'components/ErrorMessage';
import { useFormatMessage } from 'hooks';
import DatePicker from 'components/DatePicker';

//  import ErrorMessage from 'components/ErrorMessage';
const schema = yup.object().shape({
    reportDate:yup.string().required()
});
const AddPastReports = ({ id, user}) => {
  const { loading, success } = useSelector(
    (state) => ({
      loading: state.users.loading,
      success: state.users.success,
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  const { register, handleSubmit, control, errors, watch, setValue } = useForm({
    defaultValues: { ...user, reportDate: new Date().toDateString() },
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

  const onSubmitHandler = (value) => {
    const newReport= {
      id,
      user,
      ...value,
      report: value?.report[0],
    };
    dispatch(uploadPastReport(newReport));
  };

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
                      {useFormatMessage('AddPastReports.uploadReport')}
                    </label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="file has-name">
                        <label className="file-label is-normal">
                          <input
                            className={classNames('file-input', {
                                'is-danger': errors.report,
                              })}
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
                </div>
                {errors.report && (
                  <div className="field is-horizontal">
                    <div className="field-label is-normal" />
                    <div className="field-body">
                      <ErrorMessage />
                    </div>
                  </div>
                )}
                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <label className="label">
                      {useFormatMessage('AddPastReports.reportDate')}
                    </label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <Controller
                        control={control}
                        name="reportDate"
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
                  {useFormatMessage('AddPastReports.reportsTable')}
                </label>
                <div className="control is-clearfix">
                  {
                    Object.entries(user.reportObj).map(([key, val]) => {
                      return (
                        <p key={key}>{key}: {val.reportUrl}</p>
                      );
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPastReports;
