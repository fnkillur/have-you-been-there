import React from 'react';
import { CreateOutlined } from '@material-ui/icons';
import { SpeedDial } from '@material-ui/lab';
import { useHistory } from 'react-router-dom';

function WriteButton() {
  const history = useHistory();

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
