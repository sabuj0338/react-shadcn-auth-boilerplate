import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZodType } from "zod";
import { Checkbox } from "./ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./ui/form";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

type Props = {
  tableName: string;
  columns: SchemaColumn[];
  schema: ZodType<any>;
  defaultValues?: Record<string, any>;
};

export default function DynamicForm({
  tableName,
  columns,
  schema,
  defaultValues,
}: Props) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: any) => {
    console.log("Form Data:", tableName, data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {columns?.map((col) => (
          <div key={col.name}>
            {col.inputType === "text" && (
              <FormField
                control={form.control}
                name={col.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{col.title}</FormLabel>
                    <FormControl>
                      <Input placeholder="Type here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {col.inputType === "number" && (
              <FormField
                control={form.control}
                name={col.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{col.title}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Type here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {col.inputType === "textarea" && (
              <FormField
                control={form.control}
                name={col.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{col.title}</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Type here..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {col.inputType === "select" && (
              <FormField
                control={form.control}
                name={col.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{col.title}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an Option" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {col.options?.map((item: KeyValue) => (
                          <SelectItem
                            key={item.value}
                            value={item.value?.toString()}
                          >
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {col.inputType === "radio" && (
              <FormField
                control={form.control}
                name={col.name}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{col.title}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {col.options?.map((item: KeyValue) => (
                          <FormItem
                            className="flex items-center space-x-3 space-y-0"
                            key={item.value}
                          >
                            <FormControl>
                              <RadioGroupItem value={item.value} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {col.inputType === "checkbox" && (
              <FormField
                control={form.control}
                name={col.name}
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base">{col.title}</FormLabel>
                    {col.options?.map((item) => (
                      <FormField
                        key={item.value ?? []}
                        control={form.control}
                        name={col.name}
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.value}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.value)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.value,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (val: string) => val !== item.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </Form>
  );
}
