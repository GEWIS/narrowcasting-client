import { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ApiKeyParameters, AuthenticationService, User, UserService } from '../api';

interface IAuthContext {
  user: User | null;
  loading: boolean;
}

const defaultContext: IAuthContext = {
  user: null,
  loading: true
};

export const AuthContext = createContext(defaultContext);

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>();
  const [loading, setLoading] = useState(true);
  const [urlSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const authenticate = async () => {
    if (urlSearchParams.has('key')) {
      const key = urlSearchParams.get('key');
      const body: ApiKeyParameters = { key };
      setUser(await AuthenticationService.authKey(body));
    } else {
      setUser(await UserService.getInformation());
    }
  };

  useEffect(() => {
    authenticate().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user && urlSearchParams.has('key')) {
      navigate('');
    }
  }, [user]);

  const context = useMemo(
    (): IAuthContext => ({
      user,
      loading
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
}
