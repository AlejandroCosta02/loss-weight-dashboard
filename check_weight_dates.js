const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkWeightDates() {
  try {
    console.log('Checking weight entries...');
    
    const weights = await prisma.dailyWeight.findMany({
      orderBy: { date: 'desc' },
      take: 10
    });

    console.log('\nRecent weight entries:');
    weights.forEach((weight, index) => {
      const utcDate = weight.date;
      const localDate = new Date(utcDate);
      const localDateString = localDate.toLocaleDateString('es-ES');
      const utcDateString = utcDate.toISOString().split('T')[0];
      
      console.log(`${index + 1}. ID: ${weight.id}`);
      console.log(`   Weight: ${weight.weight} kg`);
      console.log(`   UTC Date: ${utcDateString}`);
      console.log(`   Local Date: ${localDateString}`);
      console.log(`   Time: ${utcDate.toTimeString()}`);
      console.log('');
    });

    // Check if dates are stored with time other than 00:00:00
    const hasTimeIssues = weights.some(weight => {
      const hours = weight.date.getHours();
      const minutes = weight.date.getMinutes();
      const seconds = weight.date.getSeconds();
      return hours !== 0 || minutes !== 0 || seconds !== 0;
    });

    if (hasTimeIssues) {
      console.log('⚠️  Found weight entries with time other than 00:00:00');
      console.log('This could cause date display issues in the frontend.');
    } else {
      console.log('✅ All weight entries have correct time (00:00:00)');
    }

  } catch (error) {
    console.error('Error checking weight dates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkWeightDates(); 