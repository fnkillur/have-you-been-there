import useLoginCheck from '../../hooks/login/useLoginCheck';

function Settings() {
  useLoginCheck();

  return <div>설정</div>;
}

export default Settings;
