import { Button } from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import useLoginCheck from '../../hooks/login/useLoginCheck';
import { auth } from '../../firebase.config';

function Settings() {
  useLoginCheck();
  const history = useHistory();

  return (
    <div style={{ margin: '50px' }}>
      <Button
        variant="contained"
        style={{ marginTop: '30px' }}
        onClick={() => {
          localStorage.removeItem('HYBT_uid');
          auth.signOut().then(() => {
            history.push('/');
          });
        }}
      >
        로그아웃
      </Button>
    </div>
  );
}

export default Settings;
