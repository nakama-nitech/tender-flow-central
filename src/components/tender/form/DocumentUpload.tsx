
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormLabel } from '@/components/ui/form';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DocumentUploadProps {
  tenderId?: string;
}

export const DocumentUpload = ({ tenderId }: DocumentUploadProps) => {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${tenderId || 'new'}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('tender-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document: " + error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-2">
      <FormLabel>Documents</FormLabel>
      <div className="border border-dashed rounded-lg p-6 text-center">
        <input
          type="file"
          id="document-upload"
          className="hidden"
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.xlsx,.xls,.ppt,.pptx"
        />
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          Drag and drop files here, or click to browse
        </p>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => document.getElementById('document-upload')?.click()}
        >
          Browse Files
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Supported formats: PDF, DOCX, XLSX, PPT (Max 10MB per file)
      </p>
    </div>
  );
};
