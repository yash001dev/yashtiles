# Base64 Image Management Usage Example

## Overview
The frame customizer now uses base64 strings to store images instead of Blob URLs. This eliminates the `ERR_FILE_NOT_FOUND` errors and provides better reliability for multi-frame editing.

## Key Features

### 1. Automatic Base64 Conversion
```tsx
// When uploading an image
const handleImageUpload = async (file: File) => {
  await setImage(file); // Automatically converts to base64
};

// For specific frames
const handleFrameImageUpload = async (frameId: string, file: File) => {
  await handleImageChange(frameId, file); // Converts and stores base64 for this frame
};
```

### 2. Getting Frame Images
```tsx
const { getFrameImageUrl, getFrameImageAsFile } = useFrameCustomizer();

// Get base64 string for display (can be used directly in img src)
const imageUrl = getFrameImageUrl(frameId); // Returns base64 string or null

// Get File object for uploads/downloads
const imageFile = getFrameImageAsFile(frameId, 'custom-name.jpg'); // Returns File object or null
```

### 3. Converting Between Formats
```tsx
const { base64ToFile, base64ToImageUrl } = useFrameCustomizer();

// Convert base64 to File (useful for API uploads)
const file = base64ToFile(base64String, 'image.jpg');

// Convert base64 to display URL (base64 can be used directly, but this is for consistency)
const displayUrl = base64ToImageUrl(base64String);
```

## Usage Examples

### Display Frame Image
```tsx
// In your component
const frameImageUrl = getFrameImageUrl(frame.id);
return (
  <img 
    src={frameImageUrl || frame.image.url} 
    alt="Frame preview" 
  />
);
```

### Upload Frame to Backend
```tsx
// Convert base64 back to File for API upload
const imageFile = getFrameImageAsFile(frameId, `frame-${frameId}.jpg`);
if (imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
}
```

### Download Frame Image
```tsx
// Convert base64 to File for download
const imageFile = getFrameImageAsFile(frameId, 'my-frame.jpg');
if (imageFile) {
  const url = URL.createObjectURL(imageFile);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'my-frame.jpg';
  link.click();
  URL.revokeObjectURL(url);
}
```

## Benefits

1. **No More Blob URL Errors**: Base64 strings don't expire or get revoked
2. **Better Memory Management**: No need to manually revoke URLs
3. **Persistence**: Base64 strings can be easily stored in localStorage or databases
4. **Cross-Component Sharing**: Images can be passed between components without URL issues
5. **Easier Serialization**: Base64 strings can be JSON stringified for API calls

## Migration Notes

- All existing Blob URL functionality has been replaced with base64
- Image upload functions are now async (use `await`)
- Frame images are automatically stored as base64 in the `frameImages` state
- The hook provides both base64 access and File conversion utilities
