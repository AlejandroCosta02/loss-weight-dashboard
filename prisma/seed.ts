import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding food database...')

  const foods = [
    // Desayunos
    { nombre: 'Huevo', calorias: 155, proteinas: 12.6, grasas: 11.3, carbohidratos: 0.6, gramosPorUnidad: 60, unidad: 'unidad' },
    { nombre: 'Pan integral', calorias: 247, proteinas: 13, grasas: 4.2, carbohidratos: 41, gramosPorUnidad: 30, unidad: 'rebanada' },
    { nombre: 'Leche entera', calorias: 61, proteinas: 3.2, grasas: 3.3, carbohidratos: 4.8, gramosPorUnidad: null, unidad: 'ml' },
    { nombre: 'Avena', calorias: 389, proteinas: 16.9, grasas: 6.9, carbohidratos: 66.3, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Yogur natural', calorias: 59, proteinas: 10, grasas: 0.4, carbohidratos: 3.6, gramosPorUnidad: 125, unidad: 'taza' },
    { nombre: 'Café', calorias: 2, proteinas: 0.3, grasas: 0, carbohidratos: 0, gramosPorUnidad: null, unidad: 'taza' },
    { nombre: 'Azúcar', calorias: 387, proteinas: 0, grasas: 0, carbohidratos: 100, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Mantequilla', calorias: 717, proteinas: 0.9, grasas: 81, carbohidratos: 0.1, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Mermelada', calorias: 250, proteinas: 0.3, grasas: 0.1, carbohidratos: 65, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Queso fresco', calorias: 98, proteinas: 11, grasas: 4.3, carbohidratos: 3.4, gramosPorUnidad: null, unidad: 'g' },

    // Almuerzos y Cenas
    { nombre: 'Arroz blanco', calorias: 130, proteinas: 2.7, grasas: 0.3, carbohidratos: 28, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Pollo (pechuga)', calorias: 165, proteinas: 31, grasas: 3.6, carbohidratos: 0, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Carne de res', calorias: 250, proteinas: 26, grasas: 15, carbohidratos: 0, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Pescado (salmón)', calorias: 208, proteinas: 25, grasas: 12, carbohidratos: 0, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Atún', calorias: 144, proteinas: 30, grasas: 1, carbohidratos: 0, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Frijoles', calorias: 127, proteinas: 8.7, grasas: 0.5, carbohidratos: 23, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Lentejas', calorias: 116, proteinas: 9, grasas: 0.4, carbohidratos: 20, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Garbanzos', calorias: 164, proteinas: 8.9, grasas: 2.6, carbohidratos: 27, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Aceite de oliva', calorias: 884, proteinas: 0, grasas: 100, carbohidratos: 0, gramosPorUnidad: null, unidad: 'ml' },
    { nombre: 'Aguacate', calorias: 160, proteinas: 2, grasas: 15, carbohidratos: 9, gramosPorUnidad: 150, unidad: 'unidad' },
    { nombre: 'Tomate', calorias: 18, proteinas: 0.9, grasas: 0.2, carbohidratos: 3.9, gramosPorUnidad: 120, unidad: 'unidad' },
    { nombre: 'Lechuga', calorias: 15, proteinas: 1.4, grasas: 0.1, carbohidratos: 2.9, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Zanahoria', calorias: 41, proteinas: 0.9, grasas: 0.2, carbohidratos: 10, gramosPorUnidad: 80, unidad: 'unidad' },
    { nombre: 'Brócoli', calorias: 34, proteinas: 2.8, grasas: 0.4, carbohidratos: 7, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Espinaca', calorias: 23, proteinas: 2.9, grasas: 0.4, carbohidratos: 3.6, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Cebolla', calorias: 40, proteinas: 1.1, grasas: 0.1, carbohidratos: 9.3, gramosPorUnidad: 100, unidad: 'unidad' },
    { nombre: 'Ajo', calorias: 149, proteinas: 6.4, grasas: 0.5, carbohidratos: 33, gramosPorUnidad: 5, unidad: 'diente' },
    { nombre: 'Papa', calorias: 77, proteinas: 2, grasas: 0.1, carbohidratos: 17, gramosPorUnidad: 150, unidad: 'unidad' },
    { nombre: 'Plátano', calorias: 89, proteinas: 1.1, grasas: 0.3, carbohidratos: 23, gramosPorUnidad: 120, unidad: 'unidad' },
    { nombre: 'Manzana', calorias: 52, proteinas: 0.3, grasas: 0.2, carbohidratos: 14, gramosPorUnidad: 150, unidad: 'unidad' },
    { nombre: 'Naranja', calorias: 47, proteinas: 0.9, grasas: 0.1, carbohidratos: 12, gramosPorUnidad: 130, unidad: 'unidad' },
    { nombre: 'Fresa', calorias: 32, proteinas: 0.7, grasas: 0.3, carbohidratos: 8, gramosPorUnidad: 12, unidad: 'unidad' },
    { nombre: 'Uva', calorias: 62, proteinas: 0.6, grasas: 0.2, carbohidratos: 16, gramosPorUnidad: null, unidad: 'g' },

    // Snacks y Meriendas
    { nombre: 'Nueces', calorias: 654, proteinas: 15, grasas: 65, carbohidratos: 14, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Almendras', calorias: 579, proteinas: 21, grasas: 50, carbohidratos: 22, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Maní', calorias: 567, proteinas: 26, grasas: 49, carbohidratos: 16, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Galletas', calorias: 502, proteinas: 5.8, grasas: 25, carbohidratos: 65, gramosPorUnidad: 15, unidad: 'unidad' },
    { nombre: 'Chocolate negro', calorias: 546, proteinas: 4.9, grasas: 31, carbohidratos: 61, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Helado', calorias: 207, proteinas: 3.5, grasas: 11, carbohidratos: 24, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Chips de papa', calorias: 536, proteinas: 7, grasas: 35, carbohidratos: 53, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Palomitas', calorias: 375, proteinas: 11, grasas: 4, carbohidratos: 74, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Cereal', calorias: 378, proteinas: 13, grasas: 1.5, carbohidratos: 78, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Miel', calorias: 304, proteinas: 0.3, grasas: 0, carbohidratos: 82, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Mantequilla de maní', calorias: 588, proteinas: 25, grasas: 50, carbohidratos: 20, gramosPorUnidad: null, unidad: 'g' },
    { nombre: 'Jugo de naranja', calorias: 45, proteinas: 0.7, grasas: 0.2, carbohidratos: 10, gramosPorUnidad: null, unidad: 'ml' },
    { nombre: 'Té', calorias: 1, proteinas: 0, grasas: 0, carbohidratos: 0.2, gramosPorUnidad: null, unidad: 'taza' },
    { nombre: 'Agua', calorias: 0, proteinas: 0, grasas: 0, carbohidratos: 0, gramosPorUnidad: null, unidad: 'ml' },
    { nombre: 'Coca Cola', calorias: 42, proteinas: 0, grasas: 0, carbohidratos: 11, gramosPorUnidad: null, unidad: 'ml' },
    { nombre: 'Cerveza', calorias: 43, proteinas: 0.5, grasas: 0, carbohidratos: 3.6, gramosPorUnidad: null, unidad: 'ml' },
    { nombre: 'Vino tinto', calorias: 85, proteinas: 0.1, grasas: 0, carbohidratos: 2.6, gramosPorUnidad: null, unidad: 'ml' },
  ]

  for (const food of foods) {
    await prisma.food.upsert({
      where: { nombre: food.nombre },
      update: food,
      create: food,
    })
  }

  console.log(`✅ Seeded ${foods.length} foods`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 