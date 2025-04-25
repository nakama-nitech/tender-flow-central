import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Save, Loader2 } from 'lucide-react';
import { TenderFormHeader } from './tender/form/TenderFormHeader';
import { DocumentUpload } from './tender/form/DocumentUpload';
import { useTenderForm } from '@/hooks/admin/useTenderForm';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, X, Plus } from 'lucide-react';
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { TenderCategory } from '@/types/tender';

interface TenderFormProps {
  onCancel: () => void;
  tenderId?: string;
}

const TenderForm: React.FC<TenderFormProps> = ({ onCancel, tenderId }) => {
  const { form, isSubmitting, initialLoadDone, onSubmit } = useTenderForm(tenderId);
  const [formError, setFormError] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState<string>('');
  const [showCustomCategory, setShowCustomCategory] = useState<boolean>(false);

  if (!initialLoadDone) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading tender data...</span>
      </div>
    );
  }

  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      // Since we can't dynamically add to the enum in the database,
      // this is a simplified demonstration. In a real implementation,
      // you would update the database enum.
      form.setValue('category', 'other' as TenderCategory);
      setShowCustomCategory(false);
      setCustomCategory('');
    }
  };

  return (
    <div className="space-y-6">
      <TenderFormHeader isEditing={!!tenderId} onCancel={onCancel} />

      {formError && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tender Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter tender title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <div className="flex space-x-2">
                          <Select 
                            onValueChange={(value) => {
                              if (value === 'add-new') {
                                setShowCustomCategory(true);
                              } else {
                                field.onChange(value);
                              }
                            }} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="construction">Construction</SelectItem>
                              <SelectItem value="services">Services</SelectItem>
                              <SelectItem value="goods">Goods</SelectItem>
                              <SelectItem value="consulting">Consulting</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="add-new">+ Add New Category</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {showCustomCategory && (
                            <div className="flex flex-1 space-x-2">
                              <Input 
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value)}
                                placeholder="Enter new category"
                              />
                              <Button type="button" size="sm" onClick={handleAddCustomCategory}>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setShowCustomCategory(false)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <FormDescription>
                          {showCustomCategory && "Note: Custom categories will be categorized as 'Other' in the system."}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Submission Deadline</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget (USD)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter budget amount" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed description of the tender requirements" 
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DocumentUpload tenderId={tenderId} />
              
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {tenderId ? 'Updating...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {tenderId ? 'Update Tender' : 'Save as Draft'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenderForm;
