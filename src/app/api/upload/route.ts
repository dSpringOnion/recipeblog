import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { 
  uploadToR2, 
  uploadToStream, 
  generateRecipeMediaKey, 
  validateRecipeMediaType, 
  getFileSizeLimit,
  getExtensionFromMimeType 
} from '@/lib/media/cloudflare';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const recipeId = formData.get('recipeId') as string || 'temp';

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadResults = [];

    for (const file of files) {
      // Validate file type
      if (!validateRecipeMediaType(file.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.type}` },
          { status: 400 }
        );
      }

      // Validate file size
      const sizeLimit = getFileSizeLimit(file.type);
      if (file.size > sizeLimit) {
        return NextResponse.json(
          { error: `File too large. Max size: ${sizeLimit / 1024 / 1024}MB` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      
      if (file.type.startsWith('video/')) {
        // Upload videos to Cloudflare Stream
        try {
          const streamResult = await uploadToStream(buffer, {
            name: file.name,
            creator: session.user.id,
            recipeId,
          });

          uploadResults.push({
            type: 'video',
            fileName: file.name,
            size: file.size,
            mimeType: file.type,
            uid: streamResult.uid,
            preview: streamResult.preview,
            playback: streamResult.playback,
          });
        } catch (error) {
          console.error('Stream upload failed:', error);
          return NextResponse.json(
            { error: 'Video upload failed' },
            { status: 500 }
          );
        }
      } else {
        // Upload images to R2
        try {
          const ext = getExtensionFromMimeType(file.type);
          const key = generateRecipeMediaKey(recipeId, `${Date.now()}.${ext}`, 'image');
          
          const r2Result = await uploadToR2(buffer, key, file.type, {
            originalName: file.name,
            creator: session.user.id,
            recipeId,
          });

          uploadResults.push({
            type: 'image',
            fileName: file.name,
            size: file.size,
            mimeType: file.type,
            url: r2Result.url,
            key: r2Result.key,
          });
        } catch (error) {
          console.error('R2 upload failed:', error);
          return NextResponse.json(
            { error: 'Image upload failed' },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      files: uploadResults,
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get presigned URLs for direct client uploads
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    const fileType = searchParams.get('fileType');
    const recipeId = searchParams.get('recipeId') || 'temp';

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName and fileType are required' },
        { status: 400 }
      );
    }

    if (!validateRecipeMediaType(fileType)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${fileType}` },
        { status: 400 }
      );
    }

    // Generate presigned URL for direct upload
    const ext = getExtensionFromMimeType(fileType);
    const key = generateRecipeMediaKey(recipeId, `${Date.now()}.${ext}`, 
      fileType.startsWith('video/') ? 'video' : 'image');

    // Note: For videos, we'll still need server-side processing for Stream
    if (fileType.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Videos must be uploaded via POST endpoint' },
        { status: 400 }
      );
    }

    const { generatePresignedUploadUrl } = await import('@/lib/media/cloudflare');
    const presignedUrl = await generatePresignedUploadUrl(key, fileType);

    return NextResponse.json({
      presignedUrl,
      key,
      publicUrl: `https://${process.env.CLOUDFLARE_R2_BUCKET}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`,
    });

  } catch (error) {
    console.error('Presigned URL generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}