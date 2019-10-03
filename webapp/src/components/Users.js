import React, { Component } from 'react';

import { ALL_USERS_QUERY } from '../lib/gqlQueries';
import { Paper } from '@material-ui/core';
import User from './User';
import { makeStyles } from '@material-ui/styles';
import { useQuery } from '@apollo/react-hooks';

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing(20),
  },
  userList: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: 60,
    maxWidth: 1000,
    margin: '0 auto',
  },
}));

// const Center = styled.div `   text-align: center; `; const ItemsList =
// styled.div `   display: grid;   grid-template-columns: 1fr 1fr;   grid-gap:
// 60px;   max-width: ${props => props.theme.maxWidth};   margin: 0 auto; `;

const Users = () => {
  const classes = useStyles();
  const { loading, error, data, refetch } = useQuery(ALL_USERS_QUERY);

  return (
    <Paper className={classes.root}>
      {loading && <p>Loading ...</p>}
      {!loading && error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <div className={classes.userList}>
          {data.users.map((user, idx) => (
            <User key={idx} userObject={user} />
          ))}
        </div>
      )}
    </Paper>
  );
};

export default Users;
