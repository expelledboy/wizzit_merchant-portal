import React, { Component } from 'react';

import Link from 'next/link';
import { makeStyles } from '@material-ui/styles';

// import formatMoney from "../lib/formatMoney"; import DeleteItem from
// './DeleteItem';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 1200,
    margin: '2rem auto',
    boxShadow: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
    display: 'grid',
    gridAutoColumns: '1fr',
    gridAutoFlow: 'column',
    minHeight: '15%',
  },
  image: {
    width: '100%',
    height: 400,
    objectFit: 'cover',
  },
  info: {
    lineHeight: 2,
    fontWeight: 300,
    flexGrow: 1,
    padding: '0 3rem',
    fontSize: '1.5rem',
  },
  buttonList: {
    display: 'grid',
    width: '100%',
    borderTop: `1px solid ${theme.palette.primary.light}`,
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gridGap: 1,
    background: `${theme.palette.primary.light}`,
    '& > *': {
      background: 'white',
      border: 0,
      fontSize: '1rem',
      padding: '1rem',
    },
  },
}));

const User = ({ userObject }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {userObject.image && (
        <img
          className={classes.image}
          src={userObject.image}
          alt={`${userObject.firstName} ${userObject.lastName}`}
        />
      )}
      <h3>
        <Link
          href={{
            pathname: '/user',
            query: {
              id: userObject.id,
            },
          }}>
          <a>{`${userObject.firstName} ${userObject.lastName}`}</a>
        </Link>
      </h3>
      <p>{userObject.email}</p>

      <div className={classes.buttonList}>
        <Link
          href={{
            pathname: 'update',
            query: {
              id: userObject.id,
            },
          }}>
          <a>Edit</a>
        </Link>
        {/*<button>Add to Cart</button>
          <DeleteItem id={item.id}>Delete this item</DeleteItem>*/}
      </div>
    </div>
  );
};

export default User;
