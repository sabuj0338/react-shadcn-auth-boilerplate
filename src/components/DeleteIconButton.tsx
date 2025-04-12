import {
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import Loader from "./Loader";
import { Button } from "./ui/button";

type Props = {
  rowId: string;
  refetchQueryKey: string;
  mutationFn: (body: object) => Promise<void>;
};

export default function DeleteIconButton({ rowId, refetchQueryKey, mutationFn }: Props) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      toast.success("Item deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [refetchQueryKey],
      });
    },
    onError: (error) => {
      toast.error("Failed to delete item");
      console.error("Error deleting item:", error);
    },
  });

  const handleDelete = async () => {
    deleteMutation.mutate({ ids: [rowId] });
  };

  return (
    <Button
      variant="ghost"
      className="text-red-500 hover:text-red-600"
      size="icon"
      onClick={handleDelete}
      disabled={deleteMutation.isPending}
    >
      {deleteMutation.isPending ? <Loader /> : <TrashIcon />}
    </Button>
  );
}
