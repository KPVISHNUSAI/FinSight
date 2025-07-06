
"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import * as XLSX from 'xlsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Upload, ClipboardPaste, FlaskConical, FileJson, Loader2, FileCheck2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type DataInputOptionsProps = {
  onAnalyze: (data: string) => void;
  isPending: boolean;
  placeholderData: string;
};

const validFileTypes = [
    'application/json',
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export function DataInputOptions({ onAnalyze, isPending, placeholderData }: DataInputOptionsProps) {
  const [jsonText, setJsonText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File) => {
    if (validFileTypes.includes(file.type)) {
      setFile(file);
      setFileName(file.name);
      setFileError(null);
    } else {
      setFileError("Invalid file type. Please upload a JSON, CSV, or Excel file.");
      setFile(null);
      setFileName("");
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      validateFile(selectedFile);
    }
  };

  const handleDragEvents = (e: DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(isEntering);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
        validateFile(droppedFile);
    }
  };

  const handleAnalyzeFile = () => {
    if (!file) {
      setFileError("Please select a file to analyze.");
      return;
    }
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const content = e.target?.result;
            if (!content) {
                setFileError('File appears to be empty.');
                return;
            }

            if (file.type === 'application/json') {
                onAnalyze(content as string);
            } else {
                const workbook = XLSX.read(content, { type: file.type === 'text/csv' ? 'string' : 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonResult = XLSX.utils.sheet_to_json(worksheet);
                onAnalyze(JSON.stringify(jsonResult, null, 2));
            }
        } catch (err) {
            console.error("Error parsing file:", err);
            setFileError("Could not parse the file. Please check its format.");
        }
    };

    reader.onerror = () => {
        setFileError("Error reading file.");
    }

    if (file.type === 'application/json' || file.type === 'text/csv') {
        reader.readAsText(file);
    } else { // It's an excel file
        reader.readAsArrayBuffer(file);
    }
  };

  const handleAnalyzeJson = () => {
    if (!jsonText.trim()) {
        toast({
            title: "Input Required",
            description: "Please paste your JSON data into the text area.",
            variant: "destructive"
        })
        return;
    }
    onAnalyze(jsonText);
  };

  const handleAnalyzeSample = () => {
    onAnalyze(placeholderData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Data Input Options</CardTitle>
        <CardDescription>Choose your preferred method to provide financial data for analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="file"><Upload className="mr-2" />Upload File</TabsTrigger>
            <TabsTrigger value="paste"><ClipboardPaste className="mr-2" />Paste JSON</TabsTrigger>
            <TabsTrigger value="sample"><FlaskConical className="mr-2" />Sample Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="file" className="mt-4">
            <div 
              className={cn(
                "relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg transition-colors duration-200",
                dragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                fileError && "border-destructive bg-destructive/10"
              )}
              onDragEnter={(e) => handleDragEvents(e, true)}
              onDragLeave={(e) => handleDragEvents(e, false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <Upload className="w-10 h-10 text-muted-foreground mb-4" />
              <p className="font-semibold">Drag & drop files here</p>
              <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
              <p className="text-xs text-muted-foreground">Supports JSON, CSV, and Excel files</p>
              <Input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json,.csv,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                disabled={isPending}
              />
            </div>
            {fileName && !fileError && (
                <div className="mt-4 flex items-center justify-center text-sm font-medium p-3 bg-muted rounded-md text-foreground">
                    <FileCheck2 className="w-5 h-5 mr-2 text-green-500"/>
                    <span>{fileName}</span>
                </div>
            )}
            {fileError && (
                <div className="mt-4 flex items-center justify-center text-sm font-medium p-3 bg-destructive/10 rounded-md text-destructive">
                    <AlertCircle className="w-5 h-5 mr-2"/>
                    <span>{fileError}</span>
                </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button onClick={handleAnalyzeFile} disabled={isPending || !file}>
                {isPending ? <Loader2 className="mr-2 animate-spin" /> : <FileJson className="mr-2" />}
                Analyze File
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="paste" className="mt-4">
            <Textarea
              placeholder={placeholderData}
              className="min-h-[200px] resize-y font-code text-xs"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              disabled={isPending}
            />
            <div className="mt-6 flex justify-end">
              <Button onClick={handleAnalyzeJson} disabled={isPending || !jsonText.trim()}>
                {isPending ? <Loader2 className="mr-2 animate-spin" /> : <ClipboardPaste className="mr-2" />}
                Analyze JSON
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sample" className="mt-4 text-center">
            <div className="p-8 border rounded-lg bg-muted/50">
                <CardTitle className="mb-2">Use Demo Data</CardTitle>
                <CardDescription className="mb-6 max-w-md mx-auto">
                    Don&apos;t have your own data? No problem. Use our pre-built sample dataset to see how the anomaly detection works.
                </CardDescription>
                <Button onClick={handleAnalyzeSample} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 animate-spin" /> : <FlaskConical className="mr-2" />}
                    Load Sample & Analyze
                </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
