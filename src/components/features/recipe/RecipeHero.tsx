import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecipeHeroProps {
  title: string;
  description?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
}

export function RecipeHero({ 
  title, 
  description, 
  videoUrl, 
  videoThumbnail, 
  author 
}: RecipeHeroProps) {
  return (
    <div className="relative w-full h-[400px] bg-gradient-to-r from-gray-900 to-gray-700">
      {videoThumbnail && (
        <Image
          src={videoThumbnail}
          alt={title}
          fill
          className="object-cover opacity-60"
          priority
        />
      )}
      
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          
          {description && (
            <p className="text-lg md:text-xl mb-6 text-gray-200">
              {description}
            </p>
          )}
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {author.image && (
                <Image
                  src={author.image}
                  alt={author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="text-sm text-gray-300">Recipe by</p>
                <p className="font-medium">{author.name}</p>
              </div>
            </div>
            
            {videoUrl && (
              <Badge variant="secondary" className="ml-auto">
                🎥 Video Recipe
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}