import { ColumnDef } from "@tanstack/react-table";
import { SearchIcon, SquarePenIcon, TrashIcon, XIcon } from "lucide-react";

import { newsApi } from "@/api";
import DataTable from "@/components/DataTable";
import ExportCSV from "@/components/ExportCSV";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import NewsForm from "./news-form";

type FilterOptionsType = {
  title?: string;
};

export default function NewPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptionsType | undefined>();
  const [options, setOptions] = useState<string>();

  const [rowSelection, setRowSelection] = useState({});
  const [editItem, setEditItem] = useState<INews>();
  const [openForm, setOpenForm] = useState(false);

  const query = useQuery({
    queryKey: ["newsApi.news", page, 10, options],
    queryFn: () => newsApi.news(page, 10, options),
    refetchOnWindowFocus: false,
  });

  const handleSearch = () => {
    let query = "";
    if (filters?.title) {
      query += `&title=${filters?.title}`;
    }
    setOptions(query);
  };

  const handleReset = () => {
    setFilters(undefined);
    setOptions(undefined);
  };

  // Open Create Mode
  const handleCreate = () => {
    setEditItem(undefined);
    setOpenForm(true);
  };

  const handleEdit = async (item: INews) => {
    setEditItem(item);
    setOpenForm(true);
  };

  const handleUpdateStatus = async (id: string, status: boolean) => {
    const res = await newsApi.update(id, { status });
    if (res) {
      toast.success(res.message);
      await query.refetch();
    }
  };

  const handleUpdateIsBanner = async (id: string, isBanner: boolean) => {
    const res = await newsApi.update(id, { isBanner });
    if (res) {
      toast.success(res.message);
      await query.refetch();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await newsApi.deleteNews({ ids: [id] });
    if (res) {
      toast.success(res.message);
      await query.refetch();
    }
  };

  const columns: ColumnDef<INews>[] = [
    {
      id: "select-col",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="capitalize">{row.original.title}</div>,
    },
    {
      accessorKey: "newsLink",
      header: "NewsLink",
      cell: ({ row }) => row.original.newsLink,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Switch
          checked={row.original.status}
          onCheckedChange={() =>
            handleUpdateStatus(row.original.id, !row.original.status)
          }
        />
      ),
    },
    {
      accessorKey: "isBanner",
      header: "IsBanner",
      cell: ({ row }) => (
        <Switch
          checked={row.original.isBanner}
          onCheckedChange={() =>
            handleUpdateIsBanner(row.original.id, !row.original.isBanner)
          }
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <Button
              type="button"
              onClick={() => handleEdit(row.original)}
              variant="ghost"
              className="text-amber-500 hover:text-amber-600"
            >
              <SquarePenIcon />
            </Button>
            <Button
              type="button"
              onClick={() => handleDelete(row.original.id)}
              variant="ghost"
              className="text-red-500 hover:text-red-600"
            >
              <TrashIcon />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="my-4 flex w-full items-center justify-end space-x-2">
        <Input
          placeholder="Search by title"
          value={filters?.title ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilters({ ...filters, title: e.target.value })
          }
        />
        <Button type="button" onClick={handleSearch}>
          <SearchIcon />
        </Button>
        <Button
          type="button"
          onClick={handleReset}
          variant="destructive"
          disabled={options === undefined}
        >
          <XIcon />
        </Button>
        <ExportCSV
          data={
            query.data?.data?.results?.filter((item: INews) =>
              Object.keys(rowSelection).includes(item.id)
            ) ?? []
          }
          fileName="teams.csv"
        />

        <Button onClick={handleCreate}>+ New</Button>
        <NewsForm
          open={openForm}
          setOpen={(value) => {
            setOpenForm(value);
            setEditItem(undefined);
          }}
          record={editItem}
          onSuccess={async () => {
            setEditItem(undefined);
            setOpenForm(false);
            await query.refetch();
          }}
        />
      </div>
      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            data={query.data?.results ?? []}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            pagination={{
              currentPage: page,
              onPageChange: (page) => setPage(page),
              totalPages: query.data?.totalPages ?? 0,
            }}
            isLoading={query.isFetching}
          />
        </CardContent>
      </Card>
    </div>
  );
}
