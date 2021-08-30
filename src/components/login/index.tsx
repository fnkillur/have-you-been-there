import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import firebase, { auth, signInWithGoogle } from '../../firebase.config';
import './Login.scss';
import useLoginCheck from '../../hooks/login/useLoginCheck';

function Login() {
  const history = useHistory();
  const userId = useLoginCheck();

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((user: firebase.User | null) => {
      if (!user?.email) {
        return;
      }

      localStorage.setItem('HYBT_email', user.email);
      localStorage.setItem('HYBT_name', user.displayName || '');
      localStorage.setItem('HYBT_uid', user.uid);
      history.replace('/list');
    });

    return () => {
      unSubscribe();
    };
  }, [history]);

  useEffect(() => {
    if (userId) {
      history.replace('/list');
    }
  }, [userId]);

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
