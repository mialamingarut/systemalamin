'use client';

import { motion } from 'framer-motion';
import { User, BookOpen } from 'lucide-react';

interface TeacherCardProps {
  name: string;
  photo?: string | null;
  subjects: string[];
  position: string;
  index: number;
}

export default function TeacherCard({ name, photo, subjects, position, index }: TeacherCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="glass rounded-2xl overflow-hidden card-hover border border-gray-100">
        {/* Photo Section */}
        <div className="relative h-64 bg-gradient-to-br from-primary-500 to-primary-700 overflow-hidden">
          {photo ? (
            <img
              src={photo}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-24 h-24 text-white/50" />
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Position Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-700 rounded-full text-xs font-semibold shadow-lg">
              {position}
            </span>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-6 bg-white">
          {/* Name */}
          <h3 className="font-display font-bold text-xl text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {name}
          </h3>

          {/* Subjects */}
          <div className="flex items-start space-x-2 mb-4">
            <BookOpen className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium mb-2">Mata Pelajaran:</p>
              <div className="flex flex-wrap gap-1">
                {subjects.map((subject, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs font-medium"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative Line */}
          <div className="h-1 w-16 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full group-hover:w-full transition-all duration-500" />
        </div>
      </div>
    </motion.div>
  );
}
