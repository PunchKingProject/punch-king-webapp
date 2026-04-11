import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function ContinueSignup() {
  const [sp] = useSearchParams();
  const token = sp.get('token') || '';
  console.log(token)
  const flow = sp.get('flow') as 'sponsor' | 'team';
  const navigate = useNavigate();


  // const mutation = useMutation({
  //   mutationFn: () => createUser('Dami', 'Dam@gamil.com', 'user'),
  //   onSuccess: () => {
  //     dispatch(
  //       setRid({
  //         rid: token || '1234',
  //         flow: 'user',
  //       })
  //     );
  //     navigate(`/signup/step/2?flow=${flow}&rid=${token}`, { replace: true })
  //   },
  // });

  useEffect(() => {
    // dispatch(setRid({ token: token, flow: flow })); 
        navigate(`/sign-up/step2?flow=${flow}&token=${token}`, { replace: true })
  }, [])

  return <div>ContinueSignup</div>;
}

export default ContinueSignup;
