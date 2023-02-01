import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';

import { useFormatDate } from 'hooks';
import ServicesTable from 'components/ServicesTable';
// import classNames from 'classnames';

const ServicesCard = ({title, isContinuous}) => {
    const { reportObj, loading } = useSelector(
        (state) => ({
            id: state.auth.userData.id,
            reportObj: state.auth.userData.reportObj,
            loading: state.users.loading,
        }),
        shallowEqual
    );

    const serviceIcon = isContinuous ? 'mdi-chart-areaspline' : 'mdi-application';

    const reports = reportObj ? Object.entries(reportObj).map(([key, value]) => {
        return {
            id: key,
            ...value,
        };
    }) : null;

    const columns = [
        {
            Header: '',
            accessor: 'reportObj.reportUrl',
            Cell: ({ row }) => (
                <p>{row.index + 1}.</p>
            ),
        },
        {
            Header: '',
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
                row.original.reportUrl ?
                    <span className="icon has-text-primary">
                        <i className="mdi mdi-18px mdi-check-circle" />
                    </span>
                    :
                    <span className="icon has-text-primary">
                        <i className="mdi mdi-18px mdi-lock" />
                    </span>

            ),
            disableSortBy: true,
        },
    ];
    return (
        <>
            <div className="tile is-parent">
                <div className="card tile is-child">
                    <header className="card-header">
                        <p className="card-header-title">
                            <span className="icon is-centered">
                                <i className={`mdi ${serviceIcon}`} />
                            </span>
                            {title}
                        </p>
                    </header>
                    {!reports ? (
                        <p className="card-content">
                            No reports found.
                        </p>)
                        :
                        (
                            <div className="b-table">
                                {loading ? <ClipLoader className="cliploader-center" /> : <ServicesTable columns={columns} data={reports} />}
                            </div>
                        )
                    }

                </div>
            </div>
        </>
    );
};

export default ServicesCard;
