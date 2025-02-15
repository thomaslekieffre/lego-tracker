import { SignIn } from '@clerk/nextjs';

export default function SignInPage(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary hover:bg-primary/90',
            footerActionLink: 'text-primary hover:text-primary/90',
          },
        }}
        redirectUrl="/dashboard"
      />
    </div>
  );
}
