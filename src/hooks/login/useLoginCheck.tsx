import { useHistory } from 'react-router-dom';

function useLoginCheck() {
  const history = useHistory();

  if (!sessionStorage.getItem('HYBT_email')) {
    history.replace('/');
  }
}

export default useLoginCheck;
