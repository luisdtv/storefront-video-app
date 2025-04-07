import { Redirect, usePathname } from 'expo-router';
import { useContext } from 'react';
import { AuthContext, AuthContextProvider } from './contexts/AuthContext';

export default function Root() {
  const { user } = useContext(AuthContext);
  const pathname = usePathname();

  // Prevent rendering children until the user state is known
  if (user === undefined) {
    return null;
  }

  return (
    <AuthContextProvider>
      {user ? (
        <Redirect href="/(main)" />
      ) : (
        <Redirect href="/(auth)" />
      )}
    </AuthContextProvider>
  );
}