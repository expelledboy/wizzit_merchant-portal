import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';

import Button from '@material-ui/core/Button';
import Error from './ErrorMessage';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { UPDATE_USER_MUTATION } from '../lib/gqlMutations';
import { USER_QUERY } from '../lib/gqlQueries';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(),
  },
  form: {
    //width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing(),
  },
}));

const UpateUser = props => {
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [isDirty, setIsDirty] = useState(false);
  const classes = useStyles();
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);
  const { loading, error, data, refetch } = useQuery(USER_QUERY, {
    variables: { id: props.id },
    onCompleted: data => queryToState(data),
  });

  const callUpdateUser = async e => {
    e.preventDefault();
    setIsDirty(false);
    const res = await updateUser({
      variables: {
        id: props.id,
        ...state,
      },
    });
  };

  const queryToState = data => {
    if (data && data.user && !isDirty) {
      if (
        state.firstName !== data.user.firstName ||
        state.lastName !== data.user.lastName ||
        state.email !== data.user.email
      ) {
        setState({
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
        });
      }
    }
  };

  return (
    <form onSubmit={e => callUpdateUser(e)} className={classes.form}>
      {loading && <p>Loading...</p>}
      {!loading && (!data || !data.user) && (
        <p>No User Found for ID {props.id}</p>
      )}
      {!loading && data && user.data && (
        <fieldset disabled={loading} aria-busy={loading}>
          <Error error={error} />
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="firstName">Vorname</InputLabel>
            <Input
              id="firstName"
              name="firstName"
              autoFocus
              value={state.firstName}
              onChange={e => {
                setState({ ...state, firstName: e.target.value });
                setIsDirty(true);
              }}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="lastName">Nachname</InputLabel>
            <Input
              id="lastName"
              name="lastName"
              autoFocus
              value={state.lastName}
              onChange={e => {
                setState({ ...state, lastName: e.target.value });
                setIsDirty(true);
              }}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">E-Mail</InputLabel>
            <Input
              id="email"
              name="email"
              autoFocus
              value={state.email}
              onChange={e => {
                setState({ ...state, email: e.target.value });
                setIsDirty(true);
              }}
            />
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!isDirty}>
            Sav{loading ? 'ing' : 'e'}
            changes
          </Button>
        </fieldset>
      )}
    </form>
  );
};

export default UpateUser;
