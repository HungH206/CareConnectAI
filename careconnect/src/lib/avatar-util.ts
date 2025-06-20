// Utility functions for avatar management

export const defaultAvatars = {
  doctors: ["/avatars/DrSarah.png", "/avatars/PhilD.png", "/avatars/EmmaDavis.png"],
  nurses: ["/avatars/nurse-1.jpg", "/avatars/nurse-2.jpg"],
  patients: ["/avatars/patient-default.jpg"],
}

export const generateAvatarUrl = (name: string, role = "patient") => {
  // Generate a consistent avatar based on name hash
  const hash = name.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  const avatarSets = {
    doctor: defaultAvatars.doctors,
    nurse: defaultAvatars.nurses,
    patient: defaultAvatars.patients,
  }

  const roleKey = role.toLowerCase().includes("doctor")
    ? "doctor"
    : role.toLowerCase().includes("nurse")
      ? "nurse"
      : "patient"

  const avatars = avatarSets[roleKey] || avatarSets.patient
  const index = Math.abs(hash) % avatars.length

  return avatars[index]
}

export const uploadAvatar = async (file: File): Promise<string> => {
  // This would integrate with your file upload service
  // For now, we'll create a local URL
  return URL.createObjectURL(file)
}

// Generate avatar using external services
export const generateExternalAvatar = (name: string, style = "avataaars") => {
  const encodedName = encodeURIComponent(name)

  const services = {
    avataaars: `https://avataaars.io/?name=${encodedName}`,
    dicebear: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodedName}`,
    robohash: `https://robohash.org/${encodedName}?set=set4`,
    initials: `https://ui-avatars.com/api/?name=${encodedName}&background=0d9488&color=fff&size=128`,
  }

  return services[style as keyof typeof services] || services.initials
}
