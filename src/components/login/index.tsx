import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useLoginCheck from '../../hooks/login/useLoginCheck';
import firebase, { auth, signInWithGoogle } from '../../firebase.config';
import './Login.scss';

function Login() {
  const history = useHistory();
  const [isAutoLogin, setIsAutoLogin] = useState<boolean>(false);
  const userInfo = useLoginCheck();
  const goToNextPage = () => history.replace('/map');

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((user: firebase.User | null) => {
      if (!user?.email) {
        alert('구글 로그인에 실패했습니다. 다시 시도해주세요.');
        return;
      }

      if (isAutoLogin) {
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user?.displayName || '');
      } else {
        sessionStorage.setItem('userEmail', user.email);
        sessionStorage.setItem('userName', user?.displayName || '');
      }

      goToNextPage();
    });

    return () => {
      unSubscribe();
    };
  }, [isAutoLogin]);

  if (userInfo) {
    goToNextPage();
  }

  return (
    <section className="container">
      <article className="screen-body">
        <p className="login_desc">
          반갑습니다!
          <br />
          기록을 위해서
          <br />
          로그인 해주세요.
        </p>
        <div className="login_buttons">
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button type="button" className="btn_google_login" onClick={signInWithGoogle} />
          <div className="input_auto_login">
            <label htmlFor="autoLogin">자동로그인</label>
            <input
              type="checkbox"
              id="autoLogin"
              checked={isAutoLogin}
              onChange={({ target: { checked } }) => setIsAutoLogin(checked)}
            />
          </div>
        </div>
      </article>
    </section>
  );
}

export default Login;
