import DynamicForm from "@/components/dynamic-form";
import { Card, CardContent } from "@/components/ui/card";
import { generateZodSchema, getDefaultValues } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function DashboardPage() {
  const query = useQuery({
    queryKey: ["tables", "aivideos"],
    queryFn: () =>
      axios
        .get("http://localhost:4000/v1/api/tables/schema/aivideos")
        .then((res) => res.data?.data),
    staleTime: Infinity,
  });

  return (
    <div className="px-4 py-12 sm:py-24">
      <main className="mx-auto w-full max-w-4xl">
        <div className="mt-12 flex flex-col gap-12 sm:mt-20">
          <Card>
            <CardContent>
              {query.isLoading && <>Loading...</>}
              {query.data && (
                <DynamicForm
                  tableName="aivideos"
                  schema={generateZodSchema(query.data)}
                  columns={query.data}
                  defaultValues={getDefaultValues(query.data)}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
