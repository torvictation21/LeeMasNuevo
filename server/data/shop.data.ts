import type { ShopItem } from '~/types/leemas'

export const SERVER_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'streak_shield',
    name: 'Protector de Racha',
    description: 'Evita perder tu racha si un día no alcanzas a completar tu lectura diaria.',
    price: 50,
    icon: '🛡️',
    category: 'powerup',
    badgeText: 'Popular',
    effectValue: 'streak_protection_1_day',
    isAvailable: true
  },
  {
    id: 'potion_double_xp',
    name: 'Poción de Sabiduría (2x XP)',
    description: 'Duplica toda la experiencia (XP) obtenida en tus lecturas durante las próximas 2 horas.',
    price: 75,
    icon: '🧪',
    category: 'powerup',
    badgeText: 'Potenciador',
    effectValue: '2x_xp_2_hours',
    isAvailable: true
  },
  {
    id: 'avatar_owl',
    name: 'Avatar Búho Erudito',
    description: 'Muestra tu sabiduría lectora en tu perfil y comentarios con este avatar animado.',
    price: 120,
    icon: '🦉',
    category: 'avatar',
    badgeText: 'Legendario',
    effectValue: 'avatar_owl',
    isAvailable: true
  },
  {
    id: 'avatar_fox',
    name: 'Avatar Zorro Lector',
    description: 'Un compañero astuto y veloz para tus viajes entre libros y cuentos.',
    price: 100,
    icon: '🦊',
    category: 'avatar',
    badgeText: 'Exclusivo',
    effectValue: 'avatar_fox',
    isAvailable: true
  },
  {
    id: 'theme_aurora',
    name: 'Tema Aurora Borealis',
    description: 'Paleta de colores boreal brillante con destellos turquesa y esmeralda para el modo nocturno.',
    price: 80,
    icon: '🌌',
    category: 'theme',
    badgeText: 'Visual',
    effectValue: 'theme_aurora',
    isAvailable: true
  },
  {
    id: 'theme_parchment',
    name: 'Tema Pergamino Clásico',
    description: 'Fondo sepia cálido con tipografía serifa editorial que simula las páginas de un libro clásico.',
    price: 60,
    icon: '📜',
    category: 'theme',
    badgeText: 'Retro',
    effectValue: 'theme_parchment',
    isAvailable: true
  }
]
