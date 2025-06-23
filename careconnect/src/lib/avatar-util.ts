// Utility functions for avatar management

export const defaultAvatars = {
  doctors: ["/avatars/DrSarah.png", "/avatars/PhilD.png", "/avatars/EmmaDavis.png"],
  nurses: ["/avatars/nurse-1.jpg", "/avatars/nurse-2.jpg"],
  patients: ["/avatars/patient-default.png"],
}

export const getLocalAvatar = (name: string, role = "patient") => {
  // Generate a consistent avatar based on name hash
  const hash = name.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  const roleKey = role.toLowerCase().includes("doctor")
    ? "doctors"
    : role.toLowerCase().includes("nurse")
      ? "nurses"
      : "patients"

  const avatars: string[] = (defaultAvatars as Record<string, string[]>)[roleKey] || defaultAvatars.patients
  const index = Math.abs(hash) % avatars.length

  return avatars[index]
}

// Assign specific avatars to specific people
export const getAssignedAvatar = (name: string, role: string) => {
  const assignments = {
    "Dr. Sarah Smith": "/avatars/DrSarah.png",
    "Dr. Phil Deckerson": "/avatars/PhilD.png",
    "Emma Davis": "/avatars/EmmaDavis.png",
    "Tom Johnson": "/avatars/patient-default.png",
  }

  return assignments[name as keyof typeof assignments] || getLocalAvatar(name, role)
}

export const uploadAvatar = async (file: File): Promise<string> => {
  // This would integrate with your file upload service
  // For now, we'll create a local URL
  return URL.createObjectURL(file)
}

// Generate avatar using external services (fallback)
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
