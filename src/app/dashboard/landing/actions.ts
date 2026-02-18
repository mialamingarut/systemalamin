'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { saveUploadedFile } from '@/lib/upload';

// Hero Actions
export async function getHero() {
  return await prisma.landingHero.findFirst({ where: { isActive: true } });
}

export async function updateHero(id: string, data: {
  headline: string;
  subheadline: string;
  ctaPrimary: string;
  ctaSecondary?: string;
}) {
  const result = await prisma.landingHero.update({
    where: { id },
    data,
  });
  revalidatePath('/');
  return { success: true, data: result };
}

// Stats Actions
export async function getStats() {
  return await prisma.landingStats.findFirst({ where: { isActive: true } });
}

export async function updateStats(id: string, data: {
  students: number;
  teachers: number;
  years: number;
}) {
  const result = await prisma.landingStats.update({
    where: { id },
    data,
  });
  revalidatePath('/');
  return { success: true, data: result };
}

// Gallery Actions
export async function getGalleryItems() {
  return await prisma.landingGallery.findMany({
    where: { deletedAt: null },
    orderBy: { order: 'asc' },
  });
}

export async function createGalleryItem(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    if (!file) {
      return { success: false, error: 'File tidak ditemukan' };
    }

    const imageUrl = await saveUploadedFile(file, 'gallery');

    const maxOrder = await prisma.landingGallery.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const result = await prisma.landingGallery.create({
      data: {
        title,
        description,
        image: imageUrl,
        category,
        order: (maxOrder?.order || 0) + 1,
      },
    });

    revalidatePath('/');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateGalleryItem(id: string, data: {
  title?: string;
  description?: string;
  category?: string;
  isActive?: boolean;
}) {
  const result = await prisma.landingGallery.update({
    where: { id },
    data,
  });
  revalidatePath('/');
  return { success: true, data: result };
}

export async function deleteGalleryItem(id: string) {
  const result = await prisma.landingGallery.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  revalidatePath('/');
  return { success: true };
}

// Feature Actions
export async function getFeatures() {
  return await prisma.landingFeature.findMany({
    where: { deletedAt: null },
    orderBy: { order: 'asc' },
  });
}

export async function createFeature(data: {
  title: string;
  description: string;
  icon: string;
}) {
  const maxOrder = await prisma.landingFeature.findFirst({
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  const result = await prisma.landingFeature.create({
    data: {
      ...data,
      order: (maxOrder?.order || 0) + 1,
    },
  });

  revalidatePath('/');
  return { success: true, data: result };
}

export async function updateFeature(id: string, data: {
  title?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}) {
  const result = await prisma.landingFeature.update({
    where: { id },
    data,
  });
  revalidatePath('/');
  return { success: true, data: result };
}

export async function deleteFeature(id: string) {
  const result = await prisma.landingFeature.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  revalidatePath('/');
  return { success: true };
}

// Program Actions
export async function getPrograms() {
  return await prisma.landingProgram.findMany({
    where: { deletedAt: null },
    orderBy: { order: 'asc' },
  });
}

export async function createProgram(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const features = JSON.parse(formData.get('features') as string);
    const file = formData.get('file') as File | null;

    let imageUrl = null;
    if (file) {
      imageUrl = await saveUploadedFile(file, 'programs');
    }

    const maxOrder = await prisma.landingProgram.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const result = await prisma.landingProgram.create({
      data: {
        title,
        description,
        image: imageUrl,
        features,
        order: (maxOrder?.order || 0) + 1,
      },
    });

    revalidatePath('/');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProgram(id: string, formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const features = JSON.parse(formData.get('features') as string);
    const file = formData.get('file') as File | null;

    const data: any = {
      title,
      description,
      features,
    };

    if (file) {
      data.image = await saveUploadedFile(file, 'programs');
    }

    const result = await prisma.landingProgram.update({
      where: { id },
      data,
    });

    revalidatePath('/');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProgram(id: string) {
  const result = await prisma.landingProgram.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  revalidatePath('/');
  return { success: true };
}

// Testimonial Actions
export async function getTestimonials() {
  return await prisma.landingTestimonial.findMany({
    where: { deletedAt: null },
    orderBy: { order: 'asc' },
  });
}

export async function createTestimonial(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const content = formData.get('content') as string;
    const rating = parseInt(formData.get('rating') as string);
    const file = formData.get('file') as File | null;

    let avatarUrl = null;
    if (file) {
      avatarUrl = await saveUploadedFile(file, 'testimonials');
    }

    const maxOrder = await prisma.landingTestimonial.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const result = await prisma.landingTestimonial.create({
      data: {
        name,
        role,
        content,
        avatar: avatarUrl,
        rating,
        order: (maxOrder?.order || 0) + 1,
      },
    });

    revalidatePath('/');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTestimonial(id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const content = formData.get('content') as string;
    const rating = parseInt(formData.get('rating') as string);
    const file = formData.get('file') as File | null;

    const data: any = {
      name,
      role,
      content,
      rating,
    };

    if (file) {
      data.avatar = await saveUploadedFile(file, 'testimonials');
    }

    const result = await prisma.landingTestimonial.update({
      where: { id },
      data,
    });

    revalidatePath('/');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTestimonial(id: string) {
  const result = await prisma.landingTestimonial.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  revalidatePath('/');
  return { success: true };
}
