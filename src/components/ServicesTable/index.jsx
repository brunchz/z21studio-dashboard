/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import classNames from 'classnames';
import { useTable, useSortBy, usePagination } from 'react-table';
import PropTypes from 'prop-types';

// import { useFormatMessage } from 'hooks';
// import classes from './ServicesTable.module.scss';
import './ServicesTableMobile.css';

const ServicesTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    page,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="">
      <table
        className="table is-striped has-mobile-cards is-hoverable"
        {...getTableProps()}
      >
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      className={classNames(
                        { 'is-actions-cell': cell.column.id === 'actions' },
                        {
                          'has-no-head-mobile is-image-cell':
                            cell.column.id === 'logoUrl',
                        }
                      )}
                      data-label={cell.column.Header}
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

ServicesTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      Cell: PropTypes.func,
      sortType: PropTypes.string,
      id: PropTypes.string,
      disableSortBy: PropTypes.bool,
    })
  ).isRequired,
};

export default ServicesTable;
