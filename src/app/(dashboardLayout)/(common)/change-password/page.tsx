import ChangePasswordForm from "@/components/module/Auth/ChangePasswordFrom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ChangePasswordPage = () => {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="w-full max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your account password by entering your old password and the
              new one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
