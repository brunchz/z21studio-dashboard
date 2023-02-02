import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';

import ServicesTable from 'components/ServicesTable';

const ProjectServicesCard = ({ title, servicesObj }) => {
    const { loading } = useSelector(
        (state) => ({
            loading: state.users.loading
        }),
        shallowEqual
    );

    const services = servicesObj ? Object.entries(servicesObj).map(([key, value]) => {
        return {
            id: key,
            value,
        };
    }) : null;

    const columns = [
        {
            Header: '',
            id: 'index',
            accessor: 'services',
            Cell: ({ row }) => (
                <p>{row.index + 1}.</p>
            ),
        },
        {
            Header: '',
            accessor: 'services',
            Cell: ({ row }) => (
                <p>
                    {row.original}
                </p>
            ),
        },
        {
            Header: '',
            id: 'actions',
            accessor: 'services',
            Cell: () => (
                <span className="icon has-text-primary">
                    <i className="mdi mdi-18px mdi-check-circle" />
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
                                <i className="mdi mdi-application" />
                            </span>
                            {title}
                        </p>
                        {services.id}
                    </header>

                    <div className="b-table">
                        {loading ? <ClipLoader className="cliploader-center" /> : <ServicesTable columns={columns} data={servicesObj} />}
                    </div>

                </div>
            </div>
        </>
    );
};

export default ProjectServicesCard;
