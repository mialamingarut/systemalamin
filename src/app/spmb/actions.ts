'use server';

import { prisma } from '@/lib/prisma';
import { saveUploadedFile } from '@/lib/upload';
import { revalidatePath } from 'next/cache';

interface RegistrationData {
  name: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  previousSchool?: string;
}

export async function submitRegistration(formData: FormData) {
  try {
    // Get active academic year
    const activeYear = await prisma.academicYear.findFirst({
      where: { isActive: true },
    });

    if (!activeYear) {
      return {
        success: false,
        error: 'Tidak ada tahun ajaran aktif. Silakan hubungi admin.',
      };
    }

    // Generate registration number
    const count = await prisma.sPMBApplicant.count({
      where: {
        academicYearId: activeYear.id,
      },
    });
    const registrationNo = `SPMB-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    // Parse form data
    const data: RegistrationData = {
      name: formData.get('name') as string,
      gender: formData.get('gender') as 'MALE' | 'FEMALE',
      dateOfBirth: formData.get('dateOfBirth') as string,
      placeOfBirth: formData.get('placeOfBirth') as string,
      address: formData.get('address') as string,
      parentName: formData.get('parentName') as string,
      parentPhone: formData.get('parentPhone') as string,
      parentEmail: formData.get('parentEmail') as string || undefined,
      previousSchool: formData.get('previousSchool') as string || undefined,
    };

    // Handle file uploads
    let photoUrl: string | null = null;
    let birthCertificateUrl: string | null = null;
    let familyCardUrl: string | null = null;

    const photoFile = formData.get('photo') as File | null;
    const birthCertFile = formData.get('birthCertificate') as File | null;
    const familyCardFile = formData.get('familyCard') as File | null;

    if (photoFile && photoFile.size > 0) {
      photoUrl = await saveUploadedFile(photoFile, 'spmb/photos');
    }

    if (birthCertFile && birthCertFile.size > 0) {
      birthCertificateUrl = await saveUploadedFile(birthCertFile, 'spmb/documents');
    }

    if (familyCardFile && familyCardFile.size > 0) {
      familyCardUrl = await saveUploadedFile(familyCardFile, 'spmb/documents');
    }

    // Create applicant record
    const applicant = await prisma.sPMBApplicant.create({
      data: {
        registrationNo,
        academicYearId: activeYear.id,
        name: data.name,
        gender: data.gender,
        dateOfBirth: new Date(data.dateOfBirth),
        placeOfBirth: data.placeOfBirth,
        address: data.address,
        parentName: data.parentName,
        parentPhone: data.parentPhone,
        parentEmail: data.parentEmail || null,
        previousSchool: data.previousSchool || null,
        photo: photoUrl,
        birthCertificate: birthCertificateUrl,
        familyCard: familyCardUrl,
        status: 'REGISTERED',
      },
    });

    revalidatePath('/dashboard/spmb');

    return {
      success: true,
      data: {
        registrationNo: applicant.registrationNo,
        name: applicant.name,
      },
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message || 'Gagal menyimpan pendaftaran. Silakan coba lagi.',
    };
  }
}
