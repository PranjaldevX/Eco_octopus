// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Upload, FileSpreadsheet, Download, CheckCircle2 } from "lucide-react";

// interface BulkUploadDialogProps {
//   trigger?: React.ReactNode;
// }

// export function BulkUploadDialog({ trigger }: BulkUploadDialogProps) {
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [success, setSuccess] = useState(false);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//       setSuccess(false);
//     }
//   };

//   const handleUpload = () => {
//     if (!file) return;
    
//     setUploading(true);
//     setProgress(0);
//     console.log("Uploading file:", file.name);
    
//     // Simulate upload progress
//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           setUploading(false);
//           setSuccess(true);
//           return 100;
//         }
//         return prev + 10;
//       });
//     }, 200);
//   };

//   const downloadTemplate = () => {
//     console.log("Downloading CSV template");
//     // In real implementation, this would trigger a CSV download
//     alert("CSV template download started");
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         {trigger || (
//           <Button data-testid="button-bulk-upload">
//             <Upload className="w-4 h-4 mr-2" />
//             Bulk Upload
//           </Button>
//         )}
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Bulk Upload Products</DialogTitle>
//           <DialogDescription>
//             Upload a CSV file with product information
//           </DialogDescription>
//         </DialogHeader>
        
//         <div className="space-y-4">
//           <Button 
//             variant="outline" 
//             className="w-full"
//             onClick={downloadTemplate}
//             data-testid="button-download-template"
//           >
//             <Download className="w-4 h-4 mr-2" />
//             Download CSV Template
//           </Button>
          
//           <div className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate">
//             <input
//               type="file"
//               accept=".csv,.xlsx"
//               onChange={handleFileChange}
//               className="hidden"
//               id="file-upload"
//               data-testid="input-file-upload"
//             />
//             <label 
//               htmlFor="file-upload" 
//               className="cursor-pointer flex flex-col items-center gap-2"
//             >
//               <FileSpreadsheet className="w-12 h-12 text-muted-foreground" />
//               <div className="text-sm text-muted-foreground">
//                 {file ? file.name : "Click to select CSV or Excel file"}
//               </div>
//             </label>
//           </div>
          
//           {file && !success && (
//             <>
//               {uploading && (
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span>Uploading...</span>
//                     <span>{progress}%</span>
//                   </div>
//                   <Progress value={progress} />
//                 </div>
//               )}
              
//               {!uploading && (
//                 <Button 
//                   className="w-full" 
//                   onClick={handleUpload}
//                   data-testid="button-start-upload"
//                 >
//                   <Upload className="w-4 h-4 mr-2" />
//                   Upload Products
//                 </Button>
//               )}
//             </>
//           )}
          
//           {success && (
//             <div className="flex items-center justify-center gap-2 text-status-collected py-4">
//               <CheckCircle2 className="w-5 h-5" />
//               <span className="font-medium">Upload successful!</span>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileSpreadsheet, Download, CheckCircle2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserEmail } from "@/pages/LoginPage";

interface BulkUploadDialogProps {
  trigger?: React.ReactNode;
}

export function BulkUploadDialog({ trigger }: BulkUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const userEmail = getUserEmail();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // TODO: Implement bulk upload endpoint in FastAPI backend
      // For now, this will throw an error
      throw new Error("Bulk upload endpoint not implemented in backend yet");
      
      // When implemented, use:
      // const response = await fastApiRequest('/bulk_upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      // return response.json();
    },
    onSuccess: (data) => {
      setUploading(false);
      setProgress(100);
      setSuccess(true);
      toast({
        title: "Success",
        description: `${data.uploaded_count || 0} products uploaded successfully`,
      });
      setTimeout(() => {
        setFile(null);
        setSuccess(false);
        setProgress(0);
        setOpen(false);
      }, 2000);
    },
    onError: (error: any) => {
      setUploading(false);
      toast({
        title: "Error",
        description: error.message || "Failed to upload products",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith(".csv") || selectedFile.name.endsWith(".xlsx")) {
        setFile(selectedFile);
        setSuccess(false);
      } else {
        toast({
          title: "Invalid file",
          description: "Please select a CSV or Excel file",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = () => {
    if (!file || !userEmail) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", userEmail);

    uploadMutation.mutate(formData);
  };

  const downloadTemplate = () => {
    const csv = `product_name,category,material,size,batch_no,manufacture_date,price
Laptop,Electronics,Metal,15,BATCH001,2025-01-01,75000
Phone,Electronics,Glass,6.1,BATCH002,2025-01-05,45000
Monitor,Electronics,Plastic,24,BATCH003,2025-01-10,25000`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product_template.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Downloaded",
      description: "CSV template downloaded successfully",
    });
  };

  const resetDialog = () => {
    setFile(null);
    setSuccess(false);
    setProgress(0);
    setUploading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button data-testid="button-bulk-upload">
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Upload Products</DialogTitle>
          <DialogDescription>
            Coming soon. This feature will allow you to upload multiple products at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-900 dark:text-amber-200">
              ⏳ This feature is available soon. Stay tuned!
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full"
            disabled
            onClick={downloadTemplate}
            data-testid="button-download-template"
          >
            <Download className="w-4 h-4 mr-2" />
            Download CSV Template
          </Button>

          <div className="border-2 border-dashed rounded-lg p-8 text-center opacity-50 pointer-events-none">
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled
              data-testid="input-file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-not-allowed flex flex-col items-center gap-2"
            >
              <FileSpreadsheet className="w-12 h-12 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                Click to select CSV or Excel file
              </div>
            </label>
          </div>

          <Button
            className="w-full"
            disabled
            data-testid="button-start-upload"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Products
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}