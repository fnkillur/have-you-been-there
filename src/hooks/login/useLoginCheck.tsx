import { useHistory } from 'react-router-dom';

function useLoginCheck(): string {
  const history = useHistory();

  if (!localStorage.getItem('HYBT_uid')) {
    history.replace('/');
  }

  return localStorage.getItem('HYBT_uid') || '';
}

export default useLoginCheck;
