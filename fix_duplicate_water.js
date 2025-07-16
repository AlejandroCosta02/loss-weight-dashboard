const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixDuplicateWaterRecords() {
  try {
    console.log('Checking for duplicate water intake records...');
    
    // Get all water intake records grouped by date
    const waterIntakes = await prisma.waterIntake.findMany({
      include: {
        registros: true
      },
      orderBy: { fecha: 'desc' }
    });

    // Group by date
    const groupedByDate = {};
    waterIntakes.forEach(intake => {
      const dateKey = intake.fecha.toISOString().split('T')[0];
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = [];
      }
      groupedByDate[dateKey].push(intake);
    });

    let totalMerged = 0;

    for (const [dateKey, intakes] of Object.entries(groupedByDate)) {
      if (intakes.length > 1) {
        console.log(`\nFound ${intakes.length} records for date ${dateKey}:`);
        
        // Sort by creation time (oldest first)
        intakes.sort((a, b) => a.createdAt - b.createdAt);
        
        const primaryRecord = intakes[0];
        const duplicateRecords = intakes.slice(1);
        
        console.log(`Primary record ID: ${primaryRecord.id}, Total: ${primaryRecord.cantidadTotal} ml`);
        
        // Merge all records into the primary one
        let totalAmount = primaryRecord.cantidadTotal;
        let totalRecords = primaryRecord.registros.length;
        
        for (const duplicate of duplicateRecords) {
          console.log(`Merging record ID: ${duplicate.id}, Total: ${duplicate.cantidadTotal} ml`);
          
          // Add the amount to the primary record
          totalAmount += duplicate.cantidadTotal;
          
          // Move all water records to the primary record
          for (const record of duplicate.registros) {
            await prisma.waterRecord.update({
              where: { id: record.id },
              data: { waterIntakeId: primaryRecord.id }
            });
            totalRecords++;
          }
          
          // Delete the duplicate record
          await prisma.waterIntake.delete({
            where: { id: duplicate.id }
          });
        }
        
        // Update the primary record with the total amount
        await prisma.waterIntake.update({
          where: { id: primaryRecord.id },
          data: { cantidadTotal: totalAmount }
        });
        
        console.log(`✅ Merged into single record: ${totalAmount} ml, ${totalRecords} individual records`);
        totalMerged += duplicateRecords.length;
      }
    }

    if (totalMerged === 0) {
      console.log('\n✅ No duplicate records found');
    } else {
      console.log(`\n✅ Successfully merged ${totalMerged} duplicate records`);
    }

  } catch (error) {
    console.error('Error fixing duplicate water records:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDuplicateWaterRecords(); 