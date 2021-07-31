import React from 'react';
import { CreateOutlined } from '@material-ui/icons';
import { SpeedDial } from '@material-ui/lab';
import { useHistory, useLocation } from 'react-router-dom';

function WriteButton() {
  const history = useHistory();
  const location = useLocation();

  if (location.pathname === '/form') {
    return null;
  }

  return (
    <SpeedDial
      ariaLabel="/form"
      open
      className="speed-dial"
      icon={<CreateOutlined />}
      onClick={() => history.push('/form')}
    />
  );
}

export default WriteButton;
