import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Loader2, UploadCloud } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ImageUploaderDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onUploadSuccess: (url: string) => void;
};

export default function ImageUploaderDialog({
  open,
  setOpen,
  onUploadSuccess,
}: ImageUploaderDialogProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert and resize image
    const webpFile = await convertToWebP(file);

    // Generate preview
    const objectURL = URL.createObjectURL(webpFile);
    setPreview(objectURL);

    // Upload to Cloudinary
    uploadToCloudinary(webpFile);
  };

  // Converts image to WebP format & resizes it
  const convertToWebP = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;
          const maxWidth = 800;
          const scaleSize = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          let quality = 0.8;
          if (file.size > 3 * 1024 * 1024) quality = 0.4;
          else if (file.size > 2 * 1024 * 1024) quality = 0.5;
          else if (file.size > 1 * 1024 * 1024) quality = 0.6;
          else if (file.size > 500 * 1024) quality = 0.7;

          const compressImage = (quality: number) => {
            return new Promise<Blob | null>((resolve) => {
              canvas.toBlob((blob) => resolve(blob), "image/webp", quality);
            });
          };

          const compressUntilUnderLimit = async () => {
            let blob = await compressImage(quality);
            while (blob && blob.size > 250 * 1024 && quality > 0.2) {
              quality -= 0.1;
              blob = await compressImage(quality);
            }
            return blob;
          };

          compressUntilUnderLimit().then((blob) => {
            if (!blob) return;
            const webpFile = new File([blob], "image.webp", {
              type: "image/webp",
            });
            resolve(webpFile);
          });
        };
      };
    });
  };

  const uploadToCloudinary = async (file: File) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; // 🔴 Replace with your Cloudinary cloud name
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; // 🔴 Replace with your unsigned upload preset

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    setUploading(true);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const imageUrl = res.data.secure_url;
      onUploadSuccess(imageUrl);
      setOpen(false);
    } catch (err) {
      toast.error(`Upload failed: ${err}`);
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[90vw] max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <label className="flex items-center justify-center border-2 border-dashed rounded-lg h-40 cursor-pointer">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <UploadCloud className="w-6 h-6" />
                <span>Click to choose image</span>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <div className="flex justify-end">
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className="mr-2"
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button disabled>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                "Waiting for Image"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
