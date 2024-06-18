'use client';
import Link from 'next/link';
import { LoginForm } from '@/ui/components/auth/LoginForm';
import { SubmitButton } from '@/ui/components/SubmitButton';
import Image from 'next/image';
import { BACKEND_URL } from '@/constants/config';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';

export default function Login() {
  const router = useRouter();
  const { isLoggedIn, login, autoLogin } = useAuth();
  const storeToken = (value: string) => {
    try {
      localStorage.setItem('auth_token', value);
    } catch (err) {
      console.log(err);
    }
  };

  const storeUser = (user: User) => {
    try {
      const jsonValue = JSON.stringify(user);
      localStorage.setItem('auth_user', jsonValue);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <div className="flex flex-column overflow-hidden rounded-xl border border-gray-100 shadow-xl z-10 ">
        <div className="md:flex basis-1/2 hidden">
          <Image
            src="/images/auth.png" // Path to the image inside the 'public' directory
            alt="library"
            width={320}
            height={360}
          />
        </div>

        <div className="z-10 p-8 md:basis-1/2 min-w-80">
          <div className="flex flex-col ">
            <Image
              src="/images/logo.png" // Path to the image inside the 'public' directory
              alt="logo"
              width={46}
              height={46}
              className="self-center"
            />
            <p className="text-sm mt-4 text-gray-500">Welcome back!</p>
            <h3 className="text-lg font-semibold">Login to your account.</h3>
          </div>
          <LoginForm
            action={async (formData: FormData) => {
              console.log(formData.get('email'));
              console.log(formData.get('password'));
              try {
                const response = await fetch(`${BACKEND_URL}/api/users/login`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email: formData.get('email'),
                    password: formData.get('password'),
                  }),
                });

                if (response.ok) {
                  router.push('/');
                  response.json().then(data => {
                    console.log(data);
                    storeToken(data.token);
                    storeUser(data.user);
                    autoLogin();
                  });
                } else {
                  // Handle login error
                  alert('Login failed. Please check your credentials.');
                }
              } catch (error) {
                console.error('Login failed:', error);
                alert('An error occurred while processing your request.');
              }

              // signin logic
            }}
          >
            <SubmitButton>Sign in</SubmitButton>
            <p className="text-center text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/register" className="font-semibold text-gray-800">
                Sign up
              </Link>
            </p>
          </LoginForm>
        </div>
      </div>
    </div>
  );
}
