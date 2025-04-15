import { authApi } from "@/api";
import ImageUploaderDialog from "@/components/ImageUploaderDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloudIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  phoneNumber: z
    .string()
    .regex(
      /^(?:\+8801[3-9]\d{8})$/,
      "Please enter a valid Bangladesh phone number (e.g., +8801XXXXXXXXX)"
    ),
  avatar: z
    .string()
    .min(1, { message: "Avatar is required" })
    .url("Invalid image URL"), // Added validation
});

export default function EditProfilePage() {
  // State for image preview
  const navigate = useNavigate();

  const auth = useAuthStore((state) => state.auth);
  const updateAuth = useAuthStore((state) => state.update);

  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: auth?.user?.email,
      phoneNumber: auth?.user?.phoneNumber,
      avatar: auth?.user?.avatar,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await authApi.update({ ...data });
    if (res && auth) {
      const updateData: IAuth = {
        ...auth,
        user: { ...auth.user, ...data },
      };
      updateAuth(updateData);
      toast.success(res.message);
      navigate(`/profile`);
    }
  }

  return (
    <Card className="rounded-none border-0 shadow-xs mt-3">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input placeholder="Type here" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number*</FormLabel>
                    <FormControl>
                      <Input placeholder="+8801XXXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Avatar Image Url*</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute right-5 mr-0.5 top-0.5 h-4 w-4 text-muted-foreground">
                          <Button
                            type="button"
                            onClick={() => setDialogOpen(true)}
                            size="sm"
                          >
                            <UploadCloudIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Image Url"
                          className="w-full rounded bg-background pr-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex justify-end">
              <Button
                type="submit"
                className=""
                disabled={form.formState.isSubmitting}
              >
                Save Profile
              </Button>
            </div>
          </form>
        </Form>

        <ImageUploaderDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          onUploadSuccess={(url) => form.setValue("avatar", url)}
        />
      </CardContent>
    </Card>
  );
}
