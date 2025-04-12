import { authApi } from "@/api";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import { useBoolean } from "usehooks-ts";
import { z } from "zod";

const FormSchema = z.object({
  otp: z.string(),
});

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const auth = useAuthStore((state) => state.auth);
  const updateAuth = useAuthStore((state) => state.update);
  const isLoading = useBoolean(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await authApi.verifyEmail({ otp: +data.otp, email: auth?.user?.email });
    if (res && auth) {
      auth.user.isEmailVerified = true;
      await updateAuth(auth);
      if (res) {
        toast.success(res?.message);
      }
      navigate("/");
    }
  }

  const sendVerifyEmail = async () => {
    isLoading.setTrue();
    const res = await authApi.sendVerificationEmail();
    if (res) toast.success(res?.message);
    isLoading.setFalse();
  };

  if (auth && auth.user?.isEmailVerified) {
    return <Navigate to="/" />;
  }

  if (!auth) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", "")}>
          <Card className="rounded-none border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-center mx-auto">
                <Logo className="text-3xl" />
              </CardTitle>
              <CardDescription className="text-center mx-auto mt-3 text-base">
                <p>Email Verification</p>
                <p>Enter OTP that sent to your email address.</p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="flex flex-col gap-6">
                    <FormField
                      control={form.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="OTP"
                              className="w-full rounded bg-background pr-8"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col gap-2 items-center justify-between">
                      <Button
                        type="submit"
                        className="w-full rounded px-6"
                        disabled={form.formState.isSubmitting}
                      >
                        Verify
                      </Button>
                      <Button
                        type="button"
                        className="w-full rounded px-6"
                        disabled={isLoading.value}
                        onClick={sendVerifyEmail}
                      >
                        Resend OTP
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
