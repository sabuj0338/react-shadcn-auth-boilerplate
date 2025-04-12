import { newsApi } from "@/api";
import ImageUploaderDialog from "@/components/ImageUploaderDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloudIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }), // Added validation
  imageUrl: z
    .string()
    .min(1, { message: "Image URL is required" })
    .url("Invalid image URL"), // Added validation
  newsLink: z
    .string()
    .min(1, { message: "News link is required" })
    .url("Invalid news link"), // Added validation
});

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  record: INews | undefined;
  onSuccess: () => void; // Callback function to refresh data
};

export default function NewsForm({ open, record, setOpen, onSuccess }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      newsLink: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = record
      ? await newsApi.update(record.id, { ...data })
      : await newsApi.create({ ...data });
    if (res) {
      onSuccess();
    }
  }
  useEffect(() => {
    if (record) {
      form.setValue("title", record.title);
      form.setValue("imageUrl", record.imageUrl);
      form.setValue("newsLink", record.newsLink);
    }
  }, [record]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-h-[80vh] overflow-y-auto w-[90vw] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>News Form</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="Type here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Url*</FormLabel>
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

              <FormField
                control={form.control}
                name="newsLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>News Link*</FormLabel>
                    <FormControl>
                      <Input placeholder="Type here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sticky bottom-0">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {record ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <ImageUploaderDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          onUploadSuccess={(url) => form.setValue("imageUrl", url)}
        />
      </DialogContent>
    </Dialog>
  );
}
