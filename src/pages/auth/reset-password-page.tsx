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
import { Checkbox } from "@/components/ui/checkbox";
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
import { LockIcon, MailIcon, PinIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { useBoolean } from "usehooks-ts";
import { z } from "zod";

const FormSchema = z
  .object({
    otp: z.string(),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();

  const showPassword = useBoolean(false);
  const navigate = useNavigate();
  const auth = useAuthStore((state) => state.auth);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: searchParams.get("email") || "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await authApi.resetPassword({
      email: data.email,
      otp: +data.otp,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    if (res) {
      toast.success(res.message);
      navigate("/login");
    }
  }

  if (auth) {
    return <Navigate to="/" />;
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
                <p>Reset Password</p>
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
                            <div className="relative">
                              <div className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                                <PinIcon className="h-4 w-4" />
                              </div>
                              <Input
                                placeholder="OTP"
                                className="w-full rounded bg-background pr-8"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                                <MailIcon className="h-4 w-4" />
                              </div>
                              <Input
                                placeholder="Email"
                                className="w-full rounded bg-background pr-8"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                                <LockIcon className="h-4 w-4" />
                              </div>
                              <Input
                                placeholder="Password"
                                className="w-full rounded bg-background pr-8"
                                type={showPassword.value ? "text" : "password"}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                                <LockIcon className="h-4 w-4" />
                              </div>
                              <Input
                                placeholder="Confirm Password"
                                className="w-full rounded bg-background pr-8"
                                type={showPassword.value ? "text" : "password"}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showPassword"
                        className="rounded-none w-5 h-5"
                        onCheckedChange={(checked: boolean) =>
                          showPassword.setValue(checked)
                        }
                      />
                      <label
                        htmlFor="showPassword"
                        className="text-gray-500 cursor-pointer"
                      >
                        Show Password
                      </label>
                    </div>

                    <div className="flex gap-2 items-center justify-between">
                      <Button
                        type="submit"
                        className="w-full rounded px-6"
                        disabled={form.formState.isSubmitting}
                      >
                        Verify
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
