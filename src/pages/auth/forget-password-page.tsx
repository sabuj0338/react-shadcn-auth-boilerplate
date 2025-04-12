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
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export default function ForgetPasswordPage() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await authApi.forgotPassword({ email: data.email });
    if (res) {
      toast.success(res.message);
      navigate(`/reset-password?email=${data.email}`);
    }
  }
  return (
    <div>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className={cn("flex flex-col gap-6", "")}>
            <Card className="rounded-none border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-center mx-auto">
                  <Logo className="text-3xl" />
                </CardTitle>
                <CardDescription className="text-center mx-auto mt-3 text-base">
                  Please enter your registered email or username to receive a
                  secure code
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
                                  type="email"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full rounded"
                        disabled={form.formState.isSubmitting}
                      >
                        Send OTP
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
