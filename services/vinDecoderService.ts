// This is a placeholder for a real VIN decoding service.
// In a production application, this would call an external API.

interface VinDetails {
  make: string;
  model: string;
  year: number;
  engine: string;
}

export const decodeVin = async (vin: string): Promise<VinDetails> => {
  console.log(`Decoding VIN: ${vin}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (vin.toUpperCase() === 'INVALIDVIN1234567') {
      throw new Error('This VIN is blacklisted.');
  }

  if (vin.toUpperCase().startsWith('1GKS')) {
    return { make: 'Ford', model: 'F-150', year: 2022, engine: '3.5L V6 EcoBoost' };
  }
  if (vin.toUpperCase().startsWith('2GKS')) {
      return { make: 'Chevrolet', model: 'Silverado', year: 2021, engine: '5.3L V8' };
  }
  if (vin.toUpperCase().startsWith('3GKS')) {
      return { make: 'RAM', model: '1500', year: 2023, engine: '5.7L V8 HEMI' };
  }

  throw new Error('VIN not found in database.');
};