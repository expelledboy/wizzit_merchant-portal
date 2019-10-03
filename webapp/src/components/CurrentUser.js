import React from "react";
import { CURRENT_USER_QUERY } from '../lib/gqlQueries';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

const CurUser = ({ children }) => {
  const {
    loading: curUserLoading,
    error: curUserError,
    data: curUserData,
  } = useQuery(CURRENT_USER_QUERY);

  return (
    <div>
      {children({
        curUserData,
        curUserLoading,
        curUserError,
      })}
    </div>
  );
};

CurUser.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CurUser;
