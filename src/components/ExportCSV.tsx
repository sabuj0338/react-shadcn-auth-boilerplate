import { Button } from "./ui/button";

interface ExportCSVProps {
  data: object[];
  fileName: string;
}

function ExportCSV({ data, fileName }: ExportCSVProps) {
  const downloadCSV = () => {
    const csvString = [
      Object.keys(data[0]),
      ...data.map((item) => Object.values(item)),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "download.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button type="button" onClick={downloadCSV} disabled={data.length === 0}>
      Export
    </Button>
  );
}

export default ExportCSV;
