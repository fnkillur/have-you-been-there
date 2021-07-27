import { useHistory } from 'react-router-dom';
import { auth } from '../../firebase.config';

function useLoginCheck() {
  const history = useHistory();

  if (!auth.currentUser) {
    history.replace('/');
  }
}

export default useLoginCheck;
