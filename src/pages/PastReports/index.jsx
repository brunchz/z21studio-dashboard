import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';

import { useFormatMessage, useFormatDate } from 'hooks';
import Table from 'components/Table';

const PastReports = () => {
  const { id, reportObj, loading } = useSelector(
    (state) => ({
      id: state.auth.userData.id,
      reportObj: state.auth.userData.reportObj,
      loading: state.users.loading,
    }),
    shallowEqual
  );

  const reports = reportObj ? Object.entries(reportObj).map(([key, value]) => {
    return {
      id: key,
      ...value,
    };
  }) : null;

  const getReportFilename = (reportUrl) => {
    const filename = reportUrl.split(id).pop().split('?alt=media').shift().substring(1);
    return filename;
  };

  const columns = [
    {
      Header: useFormatMessage('PastReport.filename'),
      accessor: 'reportObj.reportUrl',
      Cell: ({ row }) => (
        <a
          href={row.original.reportUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="is-link" style={{ textDecorationLine: 'underline'}}>
            {getReportFilename(row.original.reportUrl)}
            <span className="icon is-normal">
            <i className="mdi mdi-link" />
          </span>
          </p>

        </a>
      ),
    },
    {
      Header: useFormatMessage('AddPastReports.reportDate'),
      accessor: 'reportDate',
      Cell: ({ row }) => (

        <p>
          {useFormatDate(row.original.reportDate, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      ),
    },
{
  Header: '',
    id: 'actions',
      accessor: 'actions',
        Cell: ({ row }) => (
          <>
            {!row.original.isAdmin && (
              <div className="buttons is-right ">
                <a
                  href={row.original.reportUrl}
                  type="button"
                  className="button is-normal is-primary"
                >
                  <span className="icon is-normal">
                    <i className="mdi mdi-download" />
                  </span>
                </a>
              </div>
            )}
          </>
        ),
          disableSortBy: true,
    },
  ];
return (
  <>
    <section className="hero is-hero-bar">
      <div className="hero-body">
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <h1 className="title">{useFormatMessage('PastReports.pastReports')}</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="section is-main-section">
      <div className="tile is-parent">
        <div className="card tile is-child">
          <header className="card-header">
            <p className="card-header-title">
              <span className="icon">
                <i className="mdi mdi-file-document  default" />
              </span>
              {useFormatMessage('PastReports.allReports')}
            </p>
          </header>
          {!reports ? (
            <p className="card-content">
              No reports found.
            </p>)
            :
            (
              <div className="b-table">
                {loading ? <ClipLoader className="cliploader-center" /> : <Table columns={columns} data={reports} />}
              </div>
            )
          }

        </div>
      </div>
    </section>
  </>
);
};

export default PastReports;
