import type { Category } from '~/types/leemas'

export const SERVER_CATEGORIES: Category[] = [
  {
    id: 'cat-aventura',
    name: 'Aventura',
    slug: 'aventura',
    icon: '🗺️',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #7357ed 0%, #3b82f6 100%)',
    description: 'Expediciones a tierras desconocidas, mapas que esconden recuerdos y viajes que pondrán a prueba tu audacia.',
    totalStories: 4,
    popularityScore: 95,
    tags: ['Exploración', 'Mapas misteriosos', 'Peligro', 'Héroes']
  },
  {
    id: 'cat-fantasia',
    name: 'Fantasía',
    slug: 'fantasia',
    icon: '🔮',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    description: 'Reinos olvidados por el tiempo, magia arcana, criaturas fantásticas y secretos que desafían las leyes naturales.',
    totalStories: 6,
    popularityScore: 98,
    tags: ['Magia', 'Hechicería', 'Criaturas míticas', 'Leyendas']
  },
  {
    id: 'cat-ciencia-ficcion',
    name: 'Ciencia Ficción',
    slug: 'ciencia-ficcion',
    icon: '🚀',
    color: '#0ea5e9',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #1e293b 100%)',
    description: 'Viajes interestelares, colonias en Marte, paradojas temporales y civilizaciones gobernadas por inteligencia artificial.',
    totalStories: 5,
    popularityScore: 92,
    tags: ['Espacio', 'Tecnología', 'Futuro', 'Inteligencia Artificial']
  },
  {
    id: 'cat-misterio',
    name: 'Misterio',
    slug: 'misterio',
    icon: '🕵️',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    description: 'Casos por resolver, crímenes sin culpable aparente y acertijos donde cada detalle puede ser la clave de la verdad.',
    totalStories: 3,
    popularityScore: 89,
    tags: ['Deducción', 'Pistas', 'Detectives', 'Suspenso']
  },
  {
    id: 'cat-terror',
    name: 'Terror',
    slug: 'terror',
    icon: '🕯️',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)',
    description: 'Suspenso psicológico y sombras que cobran vida propia cuando la vela parpadea y cae la medianoche.',
    totalStories: 2,
    popularityScore: 84,
    tags: ['Suspenso', 'Fantasmas', 'Psicológico', 'Noche']
  },
  {
    id: 'cat-microcuento',
    name: 'Microcuento',
    slug: 'microcuento',
    icon: '⚡',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    description: 'Historias ultra-breves e impactantes diseñadas para leer en 2 a 3 minutos con giros narrativos inesperados.',
    totalStories: 7,
    popularityScore: 91,
    tags: ['Lectura rápida', 'Impacto', 'Minimalismo', 'Ingenio']
  },
  {
    id: 'cat-historia',
    name: 'Historia',
    slug: 'historia',
    icon: '📜',
    color: '#d97706',
    gradient: 'linear-gradient(135deg, #d97706 0%, #78350f 100%)',
    description: 'Crónicas y relatos inspirados en épocas históricas fascinantes, civilizaciones antiguas y grandes hitos de la humanidad.',
    totalStories: 3,
    popularityScore: 78,
    tags: ['Épocas pasadas', 'Cultura', 'Biografías', 'Tradición']
  },
  {
    id: 'cat-humor',
    name: 'Humor',
    slug: 'humor',
    icon: '😄',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)',
    description: 'Comedias ligeras, malentendidos delirantes y personajes simpáticos para arrancarte una sonrisa mientras practicas lectura.',
    totalStories: 4,
    popularityScore: 87,
    tags: ['Risas', 'Ironía', 'Ligero', 'Diversión']
  }
]
