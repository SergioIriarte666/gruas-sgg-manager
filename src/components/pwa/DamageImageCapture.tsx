
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CapturedImage {
  id: string;
  file: File;
  preview: string;
  timestamp: Date;
}

interface DamageImageCaptureProps {
  damageImages: CapturedImage[];
  onImageCapture: (images: CapturedImage[]) => void;
}

export function DamageImageCapture({ damageImages, onImageCapture }: DamageImageCaptureProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const preview = URL.createObjectURL(file);

    const newImage: CapturedImage = {
      id: imageId,
      file,
      preview,
      timestamp: new Date()
    };

    if (damageImages.length >= 6) {
      toast({
        title: "Límite alcanzado",
        description: "Solo se pueden capturar 6 fotografías de daños",
        variant: "destructive"
      });
      return;
    }
    
    const updatedImages = [...damageImages, newImage];
    onImageCapture(updatedImages);
    
    toast({
      title: "Imagen de daños capturada",
      description: `Imagen ${damageImages.length + 1}/6 agregada`
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (imageId: string) => {
    const updatedImages = damageImages.filter(img => img.id !== imageId);
    const imageToRemove = damageImages.find(img => img.id === imageId);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    onImageCapture(updatedImages);
  };

  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="bg-black border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Daños y Condiciones ({damageImages.length}/6)
        </CardTitle>
        <p className="text-primary/70 text-sm">
          Capture hasta 6 fotografías para documentar daños y condiciones del vehículo
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={openCamera}
          disabled={damageImages.length >= 6}
          className="w-full bg-primary text-black hover:bg-primary/90 disabled:opacity-50"
          size="lg"
        >
          <Camera className="h-5 w-5 mr-2" />
          {damageImages.length >= 6 ? 'Límite Alcanzado' : 'Capturar Daños'}
        </Button>
        
        {damageImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {damageImages.map((image, index) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.preview}
                  alt={`Daño ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-primary/30"
                />
                <div className="absolute top-2 left-2 bg-primary text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(image.id)}
                  >
                    ✕
                  </Button>
                </div>
                <p className="text-xs text-primary/70 mt-1">
                  Foto {index + 1} - {image.timestamp.toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageCapture}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
}
