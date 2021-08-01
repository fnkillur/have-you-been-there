import useLoginCheck from '../../hooks/login/useLoginCheck';

function List() {
  useLoginCheck();

  return <div>목록</div>;
}

export default List;
