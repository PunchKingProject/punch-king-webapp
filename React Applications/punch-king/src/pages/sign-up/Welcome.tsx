import { useEffect } from 'react';

function Welcome() {
  useEffect(() => {
    localStorage.removeItem('pk_registration_draft');
  }, []);
  return <div>Welcome</div>;
}

export default Welcome;
