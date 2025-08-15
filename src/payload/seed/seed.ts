import payload from 'payload';
import { seedSizes, seedMaterials, seedFrameColors, seedHangOptions } from './seedData';
import config from '../../../payload.config';

async function seed() {
  try {
    // Initialize Payload with config
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || 'temp-secret-for-seeding',
      config,
    });

    console.log('🌱 Starting database seeding...');

    // Seed Sizes
    console.log('📏 Seeding sizes...');
    for (const sizeData of seedSizes) {
      try {
        await payload.create({
          collection: 'sizes' as any,
          data: sizeData,
        });
        console.log(`✅ Created size: ${sizeData.name}`);
      } catch (error: any) {
        console.log(`⚠️  Size ${sizeData.name} might already exist:`, error.message);
      }
    }

    // Seed Materials
    console.log('🖼️  Seeding materials...');
    for (const materialData of seedMaterials) {
      try {
        await payload.create({
          collection: 'materials' as any,
          data: materialData,
        });
        console.log(`✅ Created material: ${materialData.name}`);
      } catch (error: any) {
        console.log(`⚠️  Material ${materialData.name} might already exist:`, error.message);
      }
    }

    // Seed Frame Colors
    console.log('🎨 Seeding frame colors...');
    for (const colorData of seedFrameColors) {
      try {
        await payload.create({
          collection: 'frame-colors' as any,
          data: colorData,
        });
        console.log(`✅ Created frame color: ${colorData.name}`);
      } catch (error: any) {
        console.log(`⚠️  Frame color ${colorData.name} might already exist:`, error.message);
      }
    }

    // Seed Hang Options
    console.log('🪝 Seeding hang options...');
    for (const hangData of seedHangOptions) {
      try {
        await payload.create({
          collection: 'hang-options' as any,
          data: hangData,
        });
        console.log(`✅ Created hang option: ${hangData.name}`);
      } catch (error: any) {
        console.log(`⚠️  Hang option ${hangData.name} might already exist:`, error.message);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seed();
