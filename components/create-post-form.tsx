'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { blogService } from '@/lib/blog-service';
import { Plus, Upload, X, Trash2, CalendarIcon } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CreatePostFormProps {
  onPostCreated?: () => void;
  editingPost?: BlogPost | null;
  onCancelEdit?: () => void;
}

export default function CreatePostForm({ onPostCreated, editingPost, onCancelEdit }: CreatePostFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    tags: '',
    image: '',
    gallery: [] as string[],
    featured: false,
    date: new Date() // Add date field with today as default
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isEditing = !!editingPost;

  // Effect to populate form when editing
  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || '',
        content: editingPost.content || '',
        excerpt: editingPost.excerpt || '',
        author: editingPost.author || '',
        tags: Array.isArray(editingPost.tags) ? editingPost.tags.join(', ') : '',
        image: editingPost.image || '',
        gallery: editingPost.gallery || [],
        featured: editingPost.featured || false,
        date: editingPost.date ? new Date(editingPost.date) : new Date()
      });
      setShowForm(true);
    } else {
      // Reset form when not editing
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        author: '',
        tags: '',
        image: '',
        gallery: [],
        featured: false,
        date: new Date()
      });
    }
  }, [editingPost]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { imageUrl } = await blogService.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        image: imageUrl
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    try {
      const uploadPromises = Array.from(files).map(file => blogService.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      const newImageUrls = results.map(result => result.imageUrl);
      
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...newImageUrls]
      }));
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      alert('Failed to upload gallery images. Please try again.');
    } finally {
      setUploadingGallery(false);
      // Reset the input so the same files can be selected again if needed
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        date: formData.date.toISOString().split('T')[0] // Convert Date to YYYY-MM-DD string format
      };

      if (isEditing && editingPost) {
        // Update existing post
        await blogService.updatePost(editingPost.id, postData);
        alert('Post updated successfully!');
      } else {
        // Create new post
        await blogService.createPost(postData);
        alert('Post created successfully!');
      }
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        author: '',
        tags: '',
        image: '',
        gallery: [],
        featured: false,
        date: new Date()
      });
      
      setShowForm(false);
      onPostCreated?.();
      
      // If editing, call cancel edit to reset parent state
      if (isEditing) {
        onCancelEdit?.();
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert(`Failed to ${isEditing ? 'update' : 'create'} post. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingPost) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await blogService.deletePost(editingPost.id);
      alert('Post deleted successfully!');
      
      // Reset form and close
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        author: '',
        tags: '',
        image: '',
        gallery: [],
        featured: false,
        date: new Date()
      });
      
      setShowForm(false);
      onPostCreated?.(); // Refresh the post list
      onCancelEdit?.(); // Reset parent state
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    if (isEditing) {
      onCancelEdit?.();
    }
  };

  if (!showForm && !isEditing) {
    return (
      <div className="mb-8">
        <Button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Post
        </Button>
      </div>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
            <CardDescription>
              {isEditing ? 'Update your story about Muffin and Bug' : 'Share a new memory or story about Muffin and Bug'}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {isDeleting ? (
                  <Upload className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title *
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter post title"
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium mb-1">
                Author *
              </label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Post Date *
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => setFormData(prev => ({ ...prev, date: date || new Date() }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
              Excerpt *
            </label>
            <Textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              required
              placeholder="Brief description of the post"
              rows={2}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              Content *
            </label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              placeholder="Write your story here..."
              rows={6}
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-1">
              Tags
            </label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-1">
              Featured Image
            </label>
            <div className="flex items-center space-x-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
              />
              {uploadingImage && (
                <div className="flex items-center text-sm text-gray-500">
                  <Upload className="w-4 h-4 mr-1 animate-spin" />
                  Uploading...
                </div>
              )}
            </div>
            {formData.image && (
              <div className="mt-2">
                <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="gallery" className="block text-sm font-medium mb-1">
              Photo Gallery
            </label>
            <div className="flex items-center space-x-4">
              <Input
                id="gallery"
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                disabled={uploadingGallery}
              />
              {uploadingGallery && (
                <div className="flex items-center text-sm text-gray-500">
                  <Upload className="w-4 h-4 mr-1 animate-spin" />
                  Uploading gallery images...
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select multiple images to create a photo gallery for your post
            </p>
            {formData.gallery && formData.gallery.length > 0 && (
              <div className="mt-3">
                <div className="grid grid-cols-4 gap-2">
                  {formData.gallery.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="w-full h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={imageUrl}
                          alt={`Gallery image ${index + 1}`}
                          className="max-h-full max-w-full object-contain rounded-lg"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {formData.gallery.length} image{formData.gallery.length !== 1 ? 's' : ''} in gallery
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="featured" className="text-sm font-medium">
              Mark as featured post
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Post' : 'Create Post')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
