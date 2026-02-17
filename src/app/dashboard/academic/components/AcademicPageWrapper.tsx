'use client'

import { useState, useEffect } from 'react'
import { Calendar, Megaphone, Image } from 'lucide-react'
import { CalendarView } from './CalendarView'
import { AnnouncementList } from './AnnouncementList'
import { ActivityList } from './ActivityList'
import { getCalendarEvents, getAnnouncements, getActivities } from '../actions'
import { prisma } from '@/lib/prisma'
import type { CalendarEventWithRelations, AnnouncementWithRelations, ActivityWithRelations } from '../actions'

type ViewMode = 'overview' | 'calendar' | 'announcements' | 'activities'

export function AcademicPageWrapper() {
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [events, setEvents] = useState<CalendarEventWithRelations[]>([])
  const [announcements, setAnnouncements] = useState<AnnouncementWithRelations[]>([])
  const [activities, setActivities] = useState<ActivityWithRelations[]>([])
  const [academicYears, setAcademicYears] = useState<Array<{ id: string; name: string }>>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [eventsData, announcementsData, activitiesData] = await Promise.all([
        getCalendarEvents(),
        getAnnouncements(),
        getActivities(),
      ])

      setEvents(eventsData)
      setAnnouncements(announcementsData)
      setActivities(activitiesData)

      // Load academic years (simplified - in real app, create a server action)
      // For now, we'll use mock data
      setAcademicYears([
        { id: '1', name: '2025/2026' },
        { id: '2', name: '2026/2027' },
      ])
    } catch (error) {
      console.error('Failed to load academic data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (viewMode === 'calendar') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setViewMode('overview')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Kembali
        </button>
        <CalendarView events={events} academicYears={academicYears} onUpdate={loadData} />
      </div>
    )
  }

  if (viewMode === 'announcements') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setViewMode('overview')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Kembali
        </button>
        <AnnouncementList announcements={announcements} academicYears={academicYears} onUpdate={loadData} />
      </div>
    )
  }

  if (viewMode === 'activities') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setViewMode('overview')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Kembali
        </button>
        <ActivityList activities={activities} academicYears={academicYears} onUpdate={loadData} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Akademik</h1>
          <p className="text-gray-600 mt-1">Kelola kalender, pengumuman, dan kegiatan</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => setViewMode('calendar')}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow text-left"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Calendar size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Kalender Akademik</h3>
          <p className="text-sm text-gray-600 mb-4">Kelola jadwal dan event sekolah</p>
          <div className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            {events.length} event →
          </div>
        </button>

        <button
          onClick={() => setViewMode('announcements')}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow text-left"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Megaphone size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Pengumuman</h3>
          <p className="text-sm text-gray-600 mb-4">Buat dan kelola pengumuman</p>
          <div className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            {announcements.length} pengumuman →
          </div>
        </button>

        <button
          onClick={() => setViewMode('activities')}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow text-left"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4">
            <Image size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Kegiatan Sekolah</h3>
          <p className="text-sm text-gray-600 mb-4">Dokumentasi kegiatan dan foto</p>
          <div className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            {activities.length} kegiatan →
          </div>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Pengumuman Terbaru</h2>
          <button
            onClick={() => setViewMode('announcements')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Lihat Semua →
          </button>
        </div>

        {announcements.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Belum ada pengumuman</p>
        ) : (
          <div className="space-y-4">
            {announcements.slice(0, 3).map((announcement) => (
              <div
                key={announcement.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {announcement.isPinned && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                          Pinned
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(announcement.publishedAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {announcement.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
