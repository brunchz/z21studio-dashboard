/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { deleteUser, usersCleanUp, uploadPastReport } from 'state/actions/users';
import * as yup from 'yup';
import classNames from 'classnames';
import ErrorMessage from 'components/ErrorMessage';
import { useFormatMessage, useFormatDate } from 'hooks';
import DatePicker from 'components/DatePicker';
import ConfirmationModal from 'components/ConfirmationModal';
import Table from 'components/Table';
import ClipLoader from 'react-spinners/ClipLoader';

//  import ErrorMessage from 'components/ErrorMessage';
const schema = yup.object().shape({
  reportDate: yup.string().required()
});
const AddPastReports = ({ id, user }) => {
  const { error, loading, success, deleted } = useSelector(
    (state) => ({
      loading: state.users.loading,
      success: state.users.success,
      error: state.users.error,
      deleted: state.users.deleted,
    }),
    shallowEqual
  );

  const reports = user.reportObj ? Object.values(user.reportObj) : null;

  const [deleteModal, setDeleteModal] = useState({
    userId: null,
    isOpen: false,
  });

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

  useEffect(() => {
    if (deleted && !loading) {
      setDeleteModal((prevState) => ({
        userId: null,
        isOpen: !prevState.isOpen,
      }));
    }
  }, [deleted, loading]);

  const pickAnotherFileMessage = useFormatMessage('UserForm.pickAnotherFile');
  const pickFileMessage = useFormatMessage('UserForm.pickFile');

  const onSubmitHandler = (value) => {
    const newReport = {
      id,
      user,
      ...value,
      report: value?.report[0],
    };
    dispatch(uploadPastReport(newReport));
  };

  const onRemoveButtonClickHandler = (userId) => {
    setDeleteModal((prevState) => ({
      userId,
      isOpen: !prevState.isOpen,
    }));
  };

  const onCloseModalHandler = () => {
    setDeleteModal({ userId: null, isOpen: false });
  };

  const onDeleteReportHandler = () => {
    dispatch(deleteUser(deleteModal.userId));
  };
  const columns = [
    {
      Header: useFormatMessage('AddPastReports.reportDate'),
      accessor: 'reportDate',
      Cell: ({ row }) => (
        <a
          href={row.original.reportUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <small className="is-link" style={{ textDecorationLine: 'underline', }}>
            {useFormatDate(row.original.reportDate, {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </small>
          <span className="icon is-normal">
            <i className="mdi mdi-link" />
          </span>
        </a>
      ),
    },
    {
      Header: '',
      id: 'actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <>
          {!row.original.isAdmin && (
            <div className="buttons is-right">
              <button
                type="button"
                className="button is-normal is-danger"
                onClick={() => onRemoveButtonClickHandler(row.original.id)}
              >
                <span className="icon is-normal">
                  <i className="mdi mdi-trash-can" />
                </span>
              </button>
            </div>
          )}
        </>
      ),
      disableSortBy: true,
    },
  ];

  const deleteMessage = useFormatMessage('AddPastReports.delete');

  const confirmMessage = useFormatMessage('AddPastReports.confirm');

  const permDeleteMessage = useFormatMessage('AddPastReports.permDelete');

  const cancelMessage = useFormatMessage('AddPastReports.cancel');

  return (
    <>
      {deleteModal.isOpen && (
        <ConfirmationModal
          isActive={deleteModal.isOpen}
          isLoading={loading}
          confirmButtonMessage={deleteMessage}
          title={confirmMessage}
          body={permDeleteMessage}
          cancelButtonMessage={cancelMessage}
          onConfirmation={onDeleteReportHandler}
          onCancel={onCloseModalHandler}
        />
      )}
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
        <div className="tile is-parent">
          <div className="card tile is-child">
            <header className="card-header">
              <p className="card-header-title">
                <span className="icon">
                  <i className="mdi mdi-account default" />
                </span>
                {useFormatMessage('AddPastReports.reportsTable')}
              </p>
            </header>
            {!reports ? (
              <p className="card-content">
                No reports found.
              </p>)
              :
              (
                <div className="b-table">
                  {loading ? <ClipLoader /> : <Table columns={columns} data={reports} />}
                  {error && 'Show error'}
                </div>
              )
            }

          </div>
        </div>
      </div>
    </>
  );
};

export default AddPastReports;
