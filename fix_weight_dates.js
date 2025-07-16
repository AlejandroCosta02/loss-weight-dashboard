const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixWeightDates() {
  try {
    console.log('Fixing weight dates to use local time...');
    
    // Get all weight entries
    const weights = await prisma.dailyWeight.findMany({
      orderBy: { date: 'desc' }
    });

    console.log(`Found ${weights.length} weight records to update`);

    let updatedCount = 0;

    for (const weight of weights) {
      const originalDate = weight.date;
      const dateString = originalDate.toISOString().split('T')[0]; // Get YYYY-MM-DD
      
      // Create a new date with local time 00:00:00
      const [year, month, day] = dateString.split('-');
      const newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0, 0);

      // Only update if the time is not already 00:00:00
      if (originalDate.getHours() !== 0 || originalDate.getMinutes() !== 0 || originalDate.getSeconds() !== 0) {
        await prisma.dailyWeight.update({
          where: { id: weight.id },
          data: { date: newDate }
        });
        
        console.log(`Updated weight ${weight.id}: ${originalDate.toISOString()} -> ${newDate.toISOString()}`);
        updatedCount++;
      }
    }

    console.log(`\n✅ Successfully updated ${updatedCount} weight records`);
    console.log('All weight dates now use local time (00:00:00)');

  } catch (error) {
    console.error('Error fixing weight dates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixWeightDates(); 