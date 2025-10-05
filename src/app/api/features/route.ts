import { NextResponse } from 'next/server';

const FEATURE_DEFINITIONS = [
  {
    name: 'koi_period',
    description: 'Orbital Period (days)',
    unit: 'days',
    typical_range: '0.5 - 500',
    importance: 'high'
  },
  {
    name: 'koi_time0bk',
    description: 'Transit Epoch (BKJD)',
    unit: 'BKJD',
    typical_range: '100 - 2000',
    importance: 'medium'
  },
  {
    name: 'koi_impact',
    description: 'Impact Parameter',
    unit: 'dimensionless',
    typical_range: '0 - 1',
    importance: 'high'
  },
  {
    name: 'koi_duration',
    description: 'Transit Duration (hours)',
    unit: 'hours',
    typical_range: '1 - 20',
    importance: 'medium'
  },
  {
    name: 'koi_depth',
    description: 'Transit Depth (ppm)',
    unit: 'ppm',
    typical_range: '100 - 100000',
    importance: 'high'
  },
  {
    name: 'koi_prad',
    description: 'Planet Radius (Earth radii)',
    unit: 'R⊕',
    typical_range: '0.5 - 30',
    importance: 'high'
  },
  {
    name: 'koi_teq',
    description: 'Equilibrium Temperature (K)',
    unit: 'K',
    typical_range: '100 - 3000',
    importance: 'high'
  },
  {
    name: 'koi_insol',
    description: 'Insolation Flux (Earth flux)',
    unit: 'F⊕',
    typical_range: '0.1 - 1000',
    importance: 'medium'
  },
  {
    name: 'koi_model_snr',
    description: 'Transit Signal-to-Noise Ratio',
    unit: 'dimensionless',
    typical_range: '5 - 200',
    importance: 'very high'
  },
  {
    name: 'koi_tce_plnt_num',
    description: 'TCE Planet Number',
    unit: 'count',
    typical_range: '1 - 7',
    importance: 'low'
  },
  {
    name: 'koi_steff',
    description: 'Stellar Effective Temperature (K)',
    unit: 'K',
    typical_range: '3000 - 8000',
    importance: 'high'
  },
  {
    name: 'koi_slogg',
    description: 'Stellar Surface Gravity (log10(cm/s²))',
    unit: 'log10(cm/s²)',
    typical_range: '3.5 - 5.0',
    importance: 'medium'
  },
  {
    name: 'koi_srad',
    description: 'Stellar Radius (Solar radii)',
    unit: 'R☉',
    typical_range: '0.5 - 3.0',
    importance: 'medium'
  },
  {
    name: 'ra',
    description: 'Right Ascension (degrees)',
    unit: 'degrees',
    typical_range: '0 - 360',
    importance: 'low'
  },
  {
    name: 'dec',
    description: 'Declination (degrees)',
    unit: 'degrees',
    typical_range: '-90 - 90',
    importance: 'low'
  },
  {
    name: 'koi_kepmag',
    description: 'Kepler Magnitude',
    unit: 'mag',
    typical_range: '10 - 18',
    importance: 'medium'
  },
  {
    name: 'koi_fpflag_nt',
    description: 'Not Transit-Like Flag',
    unit: 'binary',
    typical_range: '0 - 1',
    importance: 'very high'
  },
  {
    name: 'koi_fpflag_ss',
    description: 'Stellar Eclipse Flag',
    unit: 'binary',
    typical_range: '0 - 1',
    importance: 'very high'
  },
  {
    name: 'koi_fpflag_co',
    description: 'Centroid Offset Flag',
    unit: 'binary',
    typical_range: '0 - 1',
    importance: 'very high'
  },
  {
    name: 'koi_fpflag_ec',
    description: 'Ephemeris Match Eclipsing Binary Flag',
    unit: 'binary',
    typical_range: '0 - 1',
    importance: 'very high'
  }
];

export async function GET() {
  return NextResponse.json({
    features: FEATURE_DEFINITIONS,
    count: FEATURE_DEFINITIONS.length
  });
}