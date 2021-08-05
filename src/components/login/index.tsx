import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import firebase, { auth, signInWithGoogle } from '../../firebase.config';
import './Login.scss';

function Login() {
  const history = useHistory();

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((user: firebase.User | null) => {
      if (!user?.email) {
        return;
      }

      sessionStorage.setItem('HYBT_email', user.email);
      sessionStorage.setItem('HYBT_name', user.displayName || '');
      history.replace('/map');
    });

    return () => {
      unSubscribe();
    };
  }, [history]);

  return (
    <article className="login_layout">
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
      </div>
    </article>
  );
}

export default Login;
