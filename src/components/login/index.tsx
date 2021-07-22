import React, {useEffect, useState} from 'react';
import firebase, {auth, signInWithGoogle} from "../../firebase.config";

function Login() {
  const [isAutoLogin, setIsAutoLogin] = useState<boolean>(false);

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((user: firebase.User | null) => {
      console.log(user?.email, user?.displayName);
    });

    return () => {
      unSubscribe();
    };
  }, []);



  return (
    <section className="container">
      <header className="screen-header">
        <h1>거기가봄?</h1>
      </header>

      <article className="screen-body">
        <div>
          <label htmlFor="autoLogin">자동로그인</label>
          <input type="checkbox" id="autoLogin" checked={isAutoLogin}
                 onChange={({target: {checked}}) => setIsAutoLogin(checked)}/>
        </div>
        <button type="button" onClick={signInWithGoogle}>구글 로그인</button>
      </article>

      <footer className="screen-footer">

      </footer>
    </section>
  );
}

export default Login;
