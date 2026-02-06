import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SharedHeader from '@/components/SharedHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { signUpAdmin } from '@/auth/auth.service';

const AdminSignUpRoute = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      const message = 'Passwords do not match';
      setErrorMessage(message);
      toast({ title: 'Sign up failed', description: message, variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    try {
      const { session, profileError } = await signUpAdmin(email, password);

      if (profileError) {
        toast({
          title: 'Profile setup issue',
          description: profileError.message,
          variant: 'destructive',
        });
      }

      if (session) {
        toast({ title: 'Account created', description: 'You are signed in as admin.' });
        navigate('/admin', { replace: true });
        return;
      }

      toast({
        title: 'Account created',
        description: 'Check your email to confirm your account.',
      });
      navigate('/admin/login', { replace: true });
    } catch (err) {
      const message = err?.message || 'Failed to create account';
      setErrorMessage(message);
      toast({
        title: 'Sign up failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SharedHeader />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Sign Up</CardTitle>
            <CardDescription>Create an admin account to manage the store.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {errorMessage ? (
                <p className="text-sm text-destructive">{errorMessage}</p>
              ) : null}
              <Button className="w-full" size="lg" type="submit" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/admin/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSignUpRoute;
