import type { Story, Badge } from '~/types/leemas'

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_step',
    title: 'Primera Página',
    description: 'Completa tu primera historia interactiva con éxito.',
    icon: '🌱',
    unlocked: true,
    unlockedAt: '2026-09-20'
  },
  {
    id: 'streak_3',
    title: 'Chispa de Hábito',
    description: 'Mantén una racha de lectura durante 3 días consecutivos.',
    icon: '🔥',
    unlocked: true,
    unlockedAt: '2026-09-22'
  },
  {
    id: 'streak_7',
    title: 'Llama Constante',
    description: 'Alcanza una racha de 7 días seguidos leyendo.',
    icon: '⚡',
    unlocked: true,
    unlockedAt: '2026-09-24'
  },
  {
    id: 'sharp_mind',
    title: 'Ojo Crítico',
    description: 'Acierta todas las preguntas de comprensión de una historia sin cometer errores.',
    icon: '🎯',
    unlocked: false,
    progress: 2,
    maxProgress: 3
  },
  {
    id: 'explorer',
    title: 'Explorador Literario',
    description: 'Lee al menos una historia de 3 géneros diferentes.',
    icon: '🧭',
    unlocked: false,
    progress: 1,
    maxProgress: 3
  },
  {
    id: 'night_owl',
    title: 'Búho Nocturno',
    description: 'Completa una lectura después de las 9:00 PM.',
    icon: '🦉',
    unlocked: false
  },
  {
    id: 'storyteller',
    title: 'Voz Propia',
    description: 'Escribe y publica tu primera historia en Lee+.',
    icon: '✍️',
    unlocked: false
  }
]

export const SEED_STORIES: Story[] = [
  {
    id: 'el-atlas-de-las-cosas-perdidas',
    title: 'El atlas de las cosas perdidas',
    author: 'Marina Solís',
    genre: 'Aventura',
    difficulty: 'Fácil',
    readingTimeMin: 6,
    coverColor: 'linear-gradient(135deg, #7357ed 0%, #3b82f6 100%)',
    coverIcon: '🗺️',
    synopsis: 'Una joven cartógrafa hereda un cuaderno antiguo cuyas páginas no trazan ciudades ni mares, sino los recuerdos que la gente olvida.',
    segments: [
      {
        type: 'text',
        label: 'Capítulo 1: El desván de los mapas',
        content: 'Irene siempre supo que su abuelo no coleccionaba mapas comunes. Mientras otros navegantes medían costas o fronteras de imperios, él guardaba planos en tinta dorada sobre piel de pergamino. La tarde en que Irene abrió el cofre de cedro en el ático, halló un tomo pesado, encuadernado en terciopelo azul noche. La portada rezaba: "Atlas de lo Inadvertido". Al pasar la primera página, el papel no mostraba cordilleras, sino la silueta exacta de un columpio que Irene creía haber soñado en su infancia.'
      },
      {
        type: 'question',
        question: {
          id: 'q1-1',
          prompt: '¿Qué diferenciaba los mapas del abuelo de los mapas convencionales?',
          type: 'choice',
          options: [
            'Estaban dibujados en computadoras modernas.',
            'No trazaban tierras comunes, sino cosas y memorias olvidadas.',
            'Eran mapas falsos vendidos en ferias ambulantes.',
            'Estaban escritos en un idioma extraterrestre.'
          ],
          correctIndex: 1,
          explanation: 'El texto señala que no medían costas ni fronteras, sino que trazaban recuerdos y cosas que la gente olvida.'
        }
      },
      {
        type: 'text',
        label: 'Capítulo 2: La tinta viviente',
        content: 'Conforme Irene rozaba el columpio con la yema del índice, una leve calidez emanó del dibujo. Sintió el olor a tierra mojada tras la tormenta de verano y el crujido metálico de las cadenas oxidadas. Pero lo más inquietante fue una nota marginal al pie de la lámina: "Aquel que mira con prisa, pasa de largo; quien mira con sosiego, encuentra el camino". Irene comprendió que el atlas no era un registro pasivo: requería paciencia y atención plena para revelar sus coordenadas.'
      },
      {
        type: 'question',
        question: {
          id: 'q1-2',
          prompt: 'En el contexto de la historia, ¿qué significa la palabra "sosiego"?',
          type: 'vocabulary',
          options: [
            'Con profunda angustia o miedo.',
            'Con tranquilidad, calma y serenidad.',
            'Con rapidez extrema para no perder tiempo.',
            'Con orgullo y desdén hacia los demás.'
          ],
          correctIndex: 1,
          explanation: '"Sosiego" alude a la quietud, calma y tranquilidad, en contraste con "quien mira con prisa".'
        }
      },
      {
        type: 'text',
        label: 'Capítulo 3: El llamado del horizonte',
        content: 'Al girar la última hoja visible, una página en blanco comenzó a impregnarse de una línea fina y dorada. Dibujaba un faro lejano al borde de un acantilado que Irene nunca había visto en fotografías de la comarca. Abajo, una inscripción parpadeaba como una brasa tenue: "Tu turno de cartografiar". Irene cerró el libro con una sonrisa serena; supo que su propia aventura apenas acababa de encenderse.'
      },
      {
        type: 'question',
        question: {
          id: 'q1-3',
          prompt: '¿Qué infiere Irene al ver aparecer el faro y la inscripción final?',
          type: 'inference',
          options: [
            'Que el libro estaba dañado por la humedad del ático.',
            'Que ahora le corresponde a ella continuar el legado y explorar lo inadvertido.',
            'Que debía vender el atlas a un museo para ganar dinero.',
            'Que su abuelo la estaba castigando con una tarea escolar.'
          ],
          correctIndex: 1,
          explanation: 'La frase "Tu turno de cartografiar" y la sonrisa de Irene demuestran que acepta con entusiasmo la misión de continuar la labor de su abuelo.'
        }
      }
    ]
  },
  {
    id: 'cartas-desde-marte',
    title: 'Cartas desde Marte',
    author: 'Mateo Rivas',
    genre: 'Ciencia Ficción',
    difficulty: 'Intermedio',
    readingTimeMin: 7,
    coverColor: 'linear-gradient(135deg, #f06f59 0%, #db2777 100%)',
    coverIcon: '🚀',
    synopsis: 'En una estación solitaria en los valles marcianos, un ingeniero recibe mensajes analógicos en papel que nadie debería poder enviar.',
    segments: [
      {
        type: 'text',
        label: 'Transmisión 01: El valle de arena roja',
        content: 'Héctor llevaba ocho meses en la Estación Umbra, una cúpula geodésica instalada en las faldas del monte Olympus. Su única labor consistía en verificar los generadores de oxígeno y enviar informes diarios al centro de mando en Houston. La soledad marciana tenía un peso casi físico: el silencio solo era interrumpido por el silbido del viento oxidado chocando contra los filtros de cuarzo.'
      },
      {
        type: 'question',
        question: {
          id: 'q2-1',
          prompt: '¿Cómo describe el narrador la atmósfera y rutina de Héctor en Marte?',
          type: 'choice',
          options: [
            'Una fiesta caótica y llena de turistas espaciales.',
            'Una rutina técnica solitaria y envuelta en un silencio sobrecogedor.',
            'Una peligrosa guerra contra invasores alienígenas.',
            'Una misión de cultivo de hortalizas gigantes.'
          ],
          correctIndex: 1,
          explanation: 'Se enfatiza su labor solitaria de verificación de generadores y el peso casi físico del silencio marciano.'
        }
      },
      {
        type: 'text',
        label: 'Transmisión 02: El buzón de esclusa',
        content: 'El martes por la mañana, la esclusa exterior alertó un ciclo de apertura no programado. Esperando encontrar una falla en las compuertas neumáticas debido al polvo de hierro, Héctor se enfundó el traje presurizado. En la bandeja hermética de desinfección no había arena: descansaba un sobre de papel doblado en cuatro pliegues, sellado con cera escarlata. La caligrafía en tinta azul rezaba: "Para quien mire las estrellas desde abajo".'
      },
      {
        type: 'question',
        question: {
          id: 'q2-2',
          prompt: '¿Por qué el hallazgo del sobre resulta tan desconcertante y extraordinario?',
          type: 'inference',
          options: [
            'Porque el papel y la cera no deberían existir ni llegar por una esclusa en un planeta desierto sin tripulantes.',
            'Porque Houston suele enviar correo ordinario por cohetes postales.',
            'Porque el sobre estaba lleno de dinero en efectivo.',
            'Porque la esclusa estaba cerrada con candado.'
          ],
          correctIndex: 0,
          explanation: 'En una base solitaria en Marte, encontrar un sobre físico tradicional sellado con cera rompe toda explicación lógica.'
        }
      },
      {
        type: 'text',
        label: 'Transmisión 03: Voces entre las dunas',
        content: 'La carta no era una amenaza ni un código militar. Era una descripción detallada de cómo florecían los jacarandás en primavera, escrita con la nostalgia de quien añora la brisa húmeda de la Tierra. Al pie, una firma borrosa: "Colonia Aurora, año 2140". Héctor consultó el reloj de su consola: en la Tierra corría apenas el año 2088. El desierto marciano no estaba vacío; estaba cruzado por ecos del futuro.'
      },
      {
        type: 'question',
        question: {
          id: 'q2-3',
          prompt: '¿Qué revelación temporal descubre Héctor al leer la fecha de la carta?',
          type: 'choice',
          options: [
            'Que la carta fue escrita hace cien años en la Edad Media.',
            'Que proviene de más de 50 años en el futuro.',
            'Que la estación Umbra nunca existió.',
            'Que el reloj de la consola estaba descompuesto.'
          ],
          correctIndex: 1,
          explanation: 'La carta marca el año 2140 mientras él vive en 2088, revelando que los mensajes viajan a través de fisuras temporales del futuro.'
        }
      }
    ]
  },
  {
    id: 'el-susurro-del-faro',
    title: 'El susurro del faro',
    author: 'Elena Costa',
    genre: 'Misterio',
    difficulty: 'Fácil',
    readingTimeMin: 5,
    coverColor: 'linear-gradient(135deg, #0ea5e9 0%, #1e293b 100%)',
    coverIcon: '🏮',
    synopsis: 'En una isla solitaria de pescadores, el haz de luz del faro antiguo comienza a proyectar sombras de barcos que nunca llegaron a puerto.',
    segments: [
      {
        type: 'text',
        label: 'Parte 1: La noche de bruma cerrada',
        content: 'Los habitantes de Puerto Capiro sabían que cuando la niebla bajaba como una sábana densa, el faro de Punta Negra no debía encenderse. Era una superstición vieja, transmitida de abuelos a nietos: "La luz que guía en la niebla también llama a lo que duerme en el fondo". Sin embargo, Lucas, el nuevo guardián suplente de diecinueve años, no creía en cuentos de marineros y pulsó el interruptor principal.'
      },
      {
        type: 'question',
        question: {
          id: 'q3-1',
          prompt: '¿Por qué los ancianos de Puerto Capiro preferían mantener el faro apagado con niebla?',
          type: 'choice',
          options: [
            'Para ahorrar bombillas y electricidad costosa.',
            'Por una antigua creencia de que la luz atraía misterios del fondo del mar.',
            'Porque el faro estaba en obras de pintura.',
            'Porque a los peces les molestaba la luz intensa.'
          ],
          correctIndex: 1,
          explanation: 'La tradición advertía que "la luz que guía en la niebla también llama a lo que duerme en el fondo".'
        }
      },
      {
        type: 'text',
        label: 'Parte 2: El reflejo en el agua',
        content: 'El reflector giró con su zumbido habitual, arrojando un rayo blanco que cortaba la tiniebla. Pero en lugar de iluminar el océano vacío, el haz proyectó sobre la niebla la silueta nítida de un bergantín de madera con las velas rasgadas. El navío no se movía por el agua: flotaba suspendido en el aire a escasos diez metros sobre las olas, silencioso como una fotografía detenida en el tiempo.'
      },
      {
        type: 'question',
        question: {
          id: 'q3-2',
          prompt: '¿Qué fenómeno inexplicable presencia Lucas al girar el reflector?',
          type: 'choice',
          options: [
            'Una bandada de gaviotas gigantes.',
            'Un barco de madera flotando suspendido en la niebla sobre el mar.',
            'Un submarino militar disparando bengalas.',
            'Una tormenta eléctrica con truenos ensordecedores.'
          ],
          correctIndex: 1,
          explanation: 'El texto narra la visión de un bergantín flotando suspendido sobre las olas en medio de la bruma.'
        }
      }
    ]
  },
  {
    id: 'el-reloj-sin-manecillas',
    title: 'El reloj sin manecillas',
    author: 'Carlos Dumas',
    genre: 'Fantasía',
    difficulty: 'Fácil',
    readingTimeMin: 4,
    coverColor: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    coverIcon: '⏳',
    synopsis: 'Un relojero ciego fabrica esferas que no miden minutos ni horas, sino momentos felices que merecen detenerse.',
    segments: [
      {
        type: 'text',
        label: 'Fragmento único: La tienda de la esquina',
        content: 'Don Bernardo no usaba lupa de aumento ni pinzas finas con la vista: guiaba sus dedos rugosos por el murmullo de los engranajes. En su taller del callejón de San Blas no había relojes de pared con péndulo ruidoso. Sus creaciones tenían un cristal liso sin números ni manijas. "La gente común cree que el tiempo es un carcelero que avanza a zancadas uniformes", le decía a los curiosos. "Mis relojes solo hacen sonar su campanita cuando quien lo lleva olvida mirar la hora y sonríe con el alma entera".'
      },
      {
        type: 'question',
        question: {
          id: 'q4-1',
          prompt: '¿Cuál es el mensaje filosófico central que transmite don Bernardo con sus relojes?',
          type: 'inference',
          options: [
            'Que los relojes con números son demasiado caros de reparar.',
            'Que el valor real del tiempo no reside en contarlo con prisa, sino en vivir los instantes de felicidad plena.',
            'Que la ceguera le impedía colocar las manecillas correctamente.',
            'Que todos deberíamos llegar tarde a nuestros compromisos laborales.'
          ],
          correctIndex: 1,
          explanation: 'Don Bernardo busca que las personas dejen de ser esclavas del reloj y aprendan a valorar los momentos de alegría genuina.'
        }
      }
    ]
  }
]
