/**
 * BilanCompetence.AI - Zustand Store
 * Global state management
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Bilan, Message, Notification } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  clearAuth: () => void
}

interface BilanState {
  currentBilan: Bilan | null
  bilans: Bilan[]
  setCurrentBilan: (bilan: Bilan | null) => void
  setBilans: (bilans: Bilan[]) => void
  addBilan: (bilan: Bilan) => void
  updateBilan: (id: string, updates: Partial<Bilan>) => void
}

interface MessageState {
  unreadCount: number
  messages: Message[]
  setUnreadCount: (count: number) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  markAsRead: (messageId: string) => void
}

interface UIState {
  sidebarOpen: boolean
  notifications: Notification[]
  toggleSidebar: () => void
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => void
  removeNotification: (id: string) => void
  markNotificationAsRead: (id: string) => void
}

type AppState = AuthState & BilanState & MessageState & UIState

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      clearAuth: () => set({ user: null, isAuthenticated: false, currentBilan: null }),

      // Bilan state
      currentBilan: null,
      bilans: [],
      setCurrentBilan: (bilan) => set({ currentBilan: bilan }),
      setBilans: (bilans) => set({ bilans }),
      addBilan: (bilan) => set((state) => ({ bilans: [bilan, ...state.bilans] })),
      updateBilan: (id, updates) =>
        set((state) => ({
          bilans: state.bilans.map((b) => (b.id === id ? { ...b, ...updates } : b)),
          currentBilan:
            state.currentBilan?.id === id
              ? { ...state.currentBilan, ...updates }
              : state.currentBilan,
        })),

      // Message state
      unreadCount: 0,
      messages: [],
      setUnreadCount: (count) => set({ unreadCount: count }),
      setMessages: (messages) => set({ messages }),
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
          unreadCount: message.receiver_id === state.user?.id && !message.is_read
            ? state.unreadCount + 1
            : state.unreadCount,
        })),
      markAsRead: (messageId) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === messageId ? { ...m, is_read: true } : m
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),

      // UI state
      sidebarOpen: true,
      notifications: [],
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: Math.random().toString(36).substr(2, 9),
              created_at: new Date().toISOString(),
              read: false,
            } as Notification,
            ...state.notifications,
          ],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
    }),
    {
      name: 'bilan-competence-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)

// Selectors for better performance
export const selectUser = (state: AppState) => state.user
export const selectIsAuthenticated = (state: AppState) => state.isAuthenticated
export const selectCurrentBilan = (state: AppState) => state.currentBilan
export const selectBilans = (state: AppState) => state.bilans
export const selectUnreadCount = (state: AppState) => state.unreadCount
export const selectNotifications = (state: AppState) => state.notifications
