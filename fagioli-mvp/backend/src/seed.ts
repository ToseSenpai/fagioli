import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma';
import { generateTrackingCode } from './utils/trackingCode';

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.statusHistory.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.repair.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.staff.deleteMany();

  // Create staff users
  const adminPasswordHash = await bcrypt.hash('password123', 10);

  const adminStaff = await prisma.staff.create({
    data: {
      email: 'admin@fagioli.it',
      passwordHash: adminPasswordHash,
      name: 'Admin Fagioli',
      role: 'admin',
    },
  });

  const operatorStaff = await prisma.staff.create({
    data: {
      email: 'operatore@fagioli.it',
      passwordHash: await bcrypt.hash('password123', 10),
      name: 'Operatore Fagioli',
      role: 'operator',
    },
  });

  console.log('Created staff users:');
  console.log('- admin@fagioli.it / password123 (admin)');
  console.log('- operatore@fagioli.it / password123 (operator)');

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Mario Rossi',
        phone: '+393331234567',
        email: 'mario.rossi@example.com',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Lucia Bianchi',
        phone: '+393337654321',
        email: 'lucia.bianchi@example.com',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Giovanni Verdi',
        phone: '+393339876543',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Anna Ferrari',
        phone: '+393335551234',
        email: 'anna.ferrari@example.com',
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Marco Neri',
        phone: '+393334445566',
      },
    }),
  ]);

  console.log(`Created ${customers.length} sample customers`);

  // Create sample vehicles
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        plate: 'AB123CD',
        brand: 'Fiat',
        model: '500',
        year: 2020,
        customerId: customers[0].id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plate: 'EF456GH',
        brand: 'Volkswagen',
        model: 'Golf',
        year: 2019,
        customerId: customers[1].id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plate: 'IJ789KL',
        brand: 'BMW',
        model: 'Serie 3',
        year: 2021,
        customerId: customers[2].id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plate: 'MN012OP',
        brand: 'Audi',
        model: 'A4',
        year: 2018,
        customerId: customers[3].id,
      },
    }),
    prisma.vehicle.create({
      data: {
        plate: 'QR345ST',
        brand: 'Mercedes',
        model: 'Classe A',
        year: 2022,
        customerId: customers[4].id,
      },
    }),
  ]);

  console.log(`Created ${vehicles.length} sample vehicles`);

  // Create sample repairs in different statuses
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const repairs = [
    {
      trackingCode: generateTrackingCode(),
      customerId: customers[0].id,
      vehicleId: vehicles[0].id,
      repairType: 'sinistro',
      insuranceCompany: 'Generali',
      policyNumber: 'POL123456',
      status: 'pre_checkin',
      preferredDate: tomorrow,
      preferredTime: '09:00',
      notes: 'Piccolo danno al paraurti anteriore',
    },
    {
      trackingCode: generateTrackingCode(),
      customerId: customers[1].id,
      vehicleId: vehicles[1].id,
      repairType: 'sinistro',
      insuranceCompany: 'UnipolSai',
      policyNumber: 'POL789012',
      status: 'bodywork',
      confirmedDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      confirmedTime: '10:00',
      estimatedCompletion: nextWeek,
      notes: 'Danno laterale sinistro, due porte da sostituire',
      staffNotes: 'Ordinati ricambi originali VW',
    },
    {
      trackingCode: generateTrackingCode(),
      customerId: customers[2].id,
      vehicleId: vehicles[2].id,
      repairType: 'estetica',
      status: 'painting',
      confirmedDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      confirmedTime: '14:00',
      estimatedCompletion: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      notes: 'Rimozione graffi profondi su cofano e parafango',
      staffNotes: 'Verniciatura completata, in asciugatura',
    },
    {
      trackingCode: generateTrackingCode(),
      customerId: customers[3].id,
      vehicleId: vehicles[3].id,
      repairType: 'sinistro',
      insuranceCompany: 'Allianz',
      policyNumber: 'POL345678',
      status: 'ready',
      confirmedDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      confirmedTime: '11:00',
      estimatedCompletion: now,
      actualCompletion: now,
      notes: 'Sostituzione paraurti posteriore dopo tamponamento',
      staffNotes: 'Lavoro completato, cliente contattato',
    },
    {
      trackingCode: generateTrackingCode(),
      customerId: customers[4].id,
      vehicleId: vehicles[4].id,
      repairType: 'meccanica',
      status: 'confirmed',
      confirmedDate: tomorrow,
      confirmedTime: '15:00',
      notes: 'Riparazione sospensioni anteriori',
    },
  ];

  for (const repairData of repairs) {
    const repair = await prisma.repair.create({
      data: repairData,
    });

    // Create status history
    const statusFlow: { [key: string]: string[] } = {
      pre_checkin: ['pre_checkin'],
      confirmed: ['pre_checkin', 'confirmed'],
      accepted: ['pre_checkin', 'confirmed', 'accepted'],
      disassembly: ['pre_checkin', 'confirmed', 'accepted', 'disassembly'],
      bodywork: ['pre_checkin', 'confirmed', 'accepted', 'disassembly', 'bodywork'],
      painting: ['pre_checkin', 'confirmed', 'accepted', 'disassembly', 'bodywork', 'painting'],
      reassembly: ['pre_checkin', 'confirmed', 'accepted', 'disassembly', 'bodywork', 'painting', 'reassembly'],
      quality_check: ['pre_checkin', 'confirmed', 'accepted', 'disassembly', 'bodywork', 'painting', 'reassembly', 'quality_check'],
      ready: ['pre_checkin', 'confirmed', 'accepted', 'disassembly', 'bodywork', 'painting', 'reassembly', 'quality_check', 'ready'],
      delivered: ['pre_checkin', 'confirmed', 'accepted', 'disassembly', 'bodywork', 'painting', 'reassembly', 'quality_check', 'ready', 'delivered'],
    };

    const statuses = statusFlow[repairData.status] || [repairData.status];

    for (let i = 0; i < statuses.length; i++) {
      const historyDate = new Date(now.getTime() - (statuses.length - i) * 24 * 60 * 60 * 1000);
      await prisma.statusHistory.create({
        data: {
          repairId: repair.id,
          status: statuses[i],
          changedBy: adminStaff.id,
          note: `Status updated to ${statuses[i]}`,
          changedAt: historyDate,
        },
      });
    }
  }

  console.log(`Created ${repairs.length} sample repairs with status history`);
  console.log('\nSample tracking codes:');

  const createdRepairs = await prisma.repair.findMany({
    include: {
      customer: true,
      vehicle: true,
    },
  });

  createdRepairs.forEach((repair) => {
    console.log(`- ${repair.trackingCode}: ${repair.vehicle?.plate} (${repair.status})`);
  });

  console.log('\nDatabase seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
