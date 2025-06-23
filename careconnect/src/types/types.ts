export interface CareTeamMember {
  id: number
  name: string
  role: string
  specialty: string
  availability: string
  image: string
  lastContact: string
  nextAppointment: string
  connectionQuality: string
  isOnline: boolean
  unreadMessages: number
  twilioChannelId: string
  preferredCommunication: string
  phone?: string
}