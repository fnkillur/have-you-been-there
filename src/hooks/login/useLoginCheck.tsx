type Props = {
  email: string;
  name: string | null;
};

function useLoginCheck(): Props | undefined {
  const emailFromStorage = localStorage.getItem('userEmail');
  if (emailFromStorage) {
    return {
      email: emailFromStorage,
      name: localStorage.getItem('userName'),
    };
  }

  const emailFromSession = sessionStorage.getItem('userEmail');
  if (emailFromSession) {
    return {
      email: emailFromSession,
      name: sessionStorage.getItem('userName'),
    };
  }

  return undefined;
}

export default useLoginCheck;
