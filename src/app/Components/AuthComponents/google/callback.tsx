
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../contexts/AuthContext';

const GoogleCallback = () => {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const token = router.query.token;
    if (token) {
      login(token);
      router.push('/dashboard');
    } else {
      console.error('No token received');
      router.push('/login');
    }
  }, [router.query]);

  return <div>Processing Google login...</div>;
};

export default GoogleCallback;