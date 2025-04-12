import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Switch } from "./ui/switch";

type Props = {
  rowId: string;
  value: boolean;
  refetchQueryKey: string;
  mutationFn: (body: { id: string; status: boolean }) => Promise<void>;
};

export default function StatusSwitchButton({
  value,
  rowId,
  refetchQueryKey,
  mutationFn,
}: Props) {
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: mutationFn,
    onSuccess: () => {
      toast.success("Item updated successfully");
      queryClient.invalidateQueries({
        queryKey: [refetchQueryKey],
      });
    },
    onError: (error) => {
      toast.error("Failed to update item");
      console.error("Error updating item:", error);
    },
  });

  const handleUpdateStatus = async () => {
    updateMutation.mutate({ status: !value, id: rowId });
  };

  return (
    <Switch
      checked={value}
      onCheckedChange={handleUpdateStatus}
      disabled={updateMutation.isPending}
    />
  );
}
