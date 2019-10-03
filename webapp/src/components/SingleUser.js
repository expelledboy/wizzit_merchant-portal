import Error from './ErrorMessage';
import Head from 'next/head';
import React from 'react';
import { SINGLE_USER_QUERY } from '../lib/gqlQueries';
import { makeStyles } from '@material-ui/styles';
import { useQuery } from '@apollo/react-hooks';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 1200,
    margin: '2rem auto',
    boxShadow: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
    display: 'grid',
    gridAutoColumns: '1fr',
    gridAutoFlow: 'column',
    minHeight: 800,
  },
  image: {
    width: '100%',
    height: 400,
    objectFit: 'cover',
  },
  info: {
    fontSize: 12,
    lineHeight: 2,
    fontWeight: 300,
    flexGrow: 1,
    padding: '0 3rem',
    fontSize: '1.5rem',
  },
  details: {
    margin: '3rem',
    fontSize: '2rem',
  },
}));

const SingleUser = ({ id }) => {
  const classes = useStyles();
  const { loading, error, data, refetch } = useQuery(SINGLE_USER_QUERY, {
    variables: { id },
  });

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && error && <Error error={error} />}
      {!loading && !error && !data.user && <p>No user found for ID {id}</p>}
      {!loading && !error && data.user && (
        <div className={classes.root}>
          <Head>
            <title>KVKeto | {data.user.title}</title>
          </Head>
          <img
            className={classes.image}
            src={data.user.largeImage}
            alt={`${data.user.firstName} ${data.user.lastName}`}
          />
          <div className={classes.details}>
            <h2>Viewing {`${data.user.firstName} ${data.user.lastName}`}</h2>
            <p className={classes.info}>{data.user.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleUser;
