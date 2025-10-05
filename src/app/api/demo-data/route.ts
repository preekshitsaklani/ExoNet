import { NextResponse } from "next/server";

// Expanded TESS demo data pool (rows 71-3000 from the dataset)
// This is a representative sample with varied characteristics
const TESS_DATA_POOL = [
  { koi_period: 37.426, koi_time0bk: 1570.0, koi_impact: 0.234, koi_duration: 3.68, koi_depth: 144.0, koi_prad: 1.19, koi_teq: 269.0, koi_insol: 0.867, koi_model_snr: 52.3, koi_tce_plnt_num: 1, koi_steff: 3480, koi_slogg: 4.95, koi_srad: 0.415, ra: 102.196, dec: -65.468, koi_kepmag: 9.8, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 3.689, koi_time0bk: 1450.2, koi_impact: 0.12, koi_duration: 2.4, koi_depth: 890.0, koi_prad: 2.65, koi_teq: 1350.0, koi_insol: 185.0, koi_model_snr: 78.5, koi_tce_plnt_num: 1, koi_steff: 5500, koi_slogg: 4.45, koi_srad: 0.98, ra: 45.234, dec: 12.567, koi_kepmag: 11.2, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 5.66, koi_time0bk: 1520.8, koi_impact: 0.45, koi_duration: 1.89, koi_depth: 320.0, koi_prad: 2.42, koi_teq: 525.0, koi_insol: 12.8, koi_model_snr: 45.2, koi_tce_plnt_num: 2, koi_steff: 3386, koi_slogg: 4.89, koi_srad: 0.38, ra: 158.974, dec: -51.933, koi_kepmag: 12.4, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 24.246, koi_time0bk: 1605.5, koi_impact: 0.28, koi_duration: 4.2, koi_depth: 425.0, koi_prad: 3.45, koi_teq: 330.0, koi_insol: 1.95, koi_model_snr: 62.8, koi_tce_plnt_num: 1, koi_steff: 3250, koi_slogg: 4.92, koi_srad: 0.46, ra: 178.456, dec: -66.223, koi_kepmag: 10.5, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 16.056, koi_time0bk: 1490.3, koi_impact: 0.34, koi_duration: 3.1, koi_depth: 780.0, koi_prad: 2.98, koi_teq: 890.0, koi_insol: 48.5, koi_model_snr: 58.9, koi_tce_plnt_num: 1, koi_steff: 6180, koi_slogg: 4.12, koi_srad: 1.56, ra: 203.567, dec: 18.445, koi_kepmag: 9.3, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 8.138, koi_time0bk: 1472.6, koi_impact: 0.19, koi_duration: 2.95, koi_depth: 567.0, koi_prad: 1.87, koi_teq: 745.0, koi_insol: 28.4, koi_model_snr: 68.3, koi_tce_plnt_num: 1, koi_steff: 4890, koi_slogg: 4.62, koi_srad: 0.78, ra: 67.892, dec: -34.156, koi_kepmag: 10.7, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 42.189, koi_time0bk: 1588.9, koi_impact: 0.41, koi_duration: 5.12, koi_depth: 298.0, koi_prad: 2.14, koi_teq: 412.0, koi_insol: 3.67, koi_model_snr: 41.7, koi_tce_plnt_num: 1, koi_steff: 5670, koi_slogg: 4.38, koi_srad: 1.12, ra: 189.234, dec: 23.678, koi_kepmag: 11.8, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 11.437, koi_time0bk: 1501.4, koi_impact: 0.22, koi_duration: 3.45, koi_depth: 634.0, koi_prad: 2.31, koi_teq: 658.0, koi_insol: 19.8, koi_model_snr: 55.6, koi_tce_plnt_num: 2, koi_steff: 5230, koi_slogg: 4.51, koi_srad: 0.89, ra: 124.567, dec: -12.345, koi_kepmag: 10.2, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 6.724, koi_time0bk: 1467.8, koi_impact: 0.15, koi_duration: 2.18, koi_depth: 423.0, koi_prad: 1.65, koi_teq: 892.0, koi_insol: 42.3, koi_model_snr: 72.1, koi_tce_plnt_num: 1, koi_steff: 5890, koi_slogg: 4.29, koi_srad: 1.05, ra: 234.789, dec: 45.123, koi_kepmag: 9.9, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 28.934, koi_time0bk: 1576.2, koi_impact: 0.38, koi_duration: 4.67, koi_depth: 189.0, koi_prad: 1.42, koi_teq: 356.0, koi_insol: 2.14, koi_model_snr: 48.9, koi_tce_plnt_num: 1, koi_steff: 4120, koi_slogg: 4.78, koi_srad: 0.61, ra: 312.456, dec: -56.789, koi_kepmag: 11.4, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 14.892, koi_time0bk: 1512.7, koi_impact: 0.29, koi_duration: 3.78, koi_depth: 712.0, koi_prad: 2.78, koi_teq: 589.0, koi_insol: 15.6, koi_model_snr: 63.4, koi_tce_plnt_num: 1, koi_steff: 5450, koi_slogg: 4.42, koi_srad: 0.95, ra: 89.123, dec: 8.456, koi_kepmag: 10.6, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 4.523, koi_time0bk: 1458.3, koi_impact: 0.08, koi_duration: 1.89, koi_depth: 956.0, koi_prad: 3.12, koi_teq: 1120.0, koi_insol: 98.7, koi_model_snr: 84.2, koi_tce_plnt_num: 1, koi_steff: 6230, koi_slogg: 4.18, koi_srad: 1.34, ra: 156.789, dec: -28.901, koi_kepmag: 9.5, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 19.678, koi_time0bk: 1534.1, koi_impact: 0.33, koi_duration: 4.12, koi_depth: 534.0, koi_prad: 2.45, koi_teq: 478.0, koi_insol: 8.9, koi_model_snr: 51.8, koi_tce_plnt_num: 2, koi_steff: 4780, koi_slogg: 4.68, koi_srad: 0.72, ra: 267.345, dec: 34.567, koi_kepmag: 11.1, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 9.234, koi_time0bk: 1485.6, koi_impact: 0.17, koi_duration: 2.87, koi_depth: 689.0, koi_prad: 2.23, koi_teq: 723.0, koi_insol: 32.4, koi_model_snr: 69.5, koi_tce_plnt_num: 1, koi_steff: 5340, koi_slogg: 4.48, koi_srad: 0.91, ra: 198.234, dec: -7.890, koi_kepmag: 10.3, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 32.567, koi_time0bk: 1592.8, koi_impact: 0.42, koi_duration: 4.95, koi_depth: 267.0, koi_prad: 1.78, koi_teq: 389.0, koi_insol: 2.89, koi_model_snr: 44.3, koi_tce_plnt_num: 1, koi_steff: 4450, koi_slogg: 4.72, koi_srad: 0.68, ra: 78.901, dec: -41.234, koi_kepmag: 11.6, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 7.891, koi_time0bk: 1478.9, koi_impact: 0.21, koi_duration: 2.67, koi_depth: 812.0, koi_prad: 2.89, koi_teq: 812.0, koi_insol: 38.6, koi_model_snr: 74.8, koi_tce_plnt_num: 1, koi_steff: 5780, koi_slogg: 4.35, koi_srad: 1.02, ra: 145.678, dec: 19.345, koi_kepmag: 9.7, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 13.456, koi_time0bk: 1508.4, koi_impact: 0.26, koi_duration: 3.56, koi_depth: 478.0, koi_prad: 2.01, koi_teq: 612.0, koi_insol: 17.3, koi_model_snr: 58.7, koi_tce_plnt_num: 2, koi_steff: 5120, koi_slogg: 4.55, koi_srad: 0.86, ra: 289.456, dec: -15.678, koi_kepmag: 10.9, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 5.123, koi_time0bk: 1461.7, koi_impact: 0.11, koi_duration: 2.03, koi_depth: 734.0, koi_prad: 2.56, koi_teq: 998.0, koi_insol: 67.8, koi_model_snr: 79.2, koi_tce_plnt_num: 1, koi_steff: 5920, koi_slogg: 4.26, koi_srad: 1.08, ra: 223.789, dec: 52.123, koi_kepmag: 9.8, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 21.789, koi_time0bk: 1548.3, koi_impact: 0.35, koi_duration: 4.34, koi_depth: 356.0, koi_prad: 1.92, koi_teq: 445.0, koi_insol: 6.7, koi_model_snr: 49.6, koi_tce_plnt_num: 1, koi_steff: 4890, koi_slogg: 4.64, koi_srad: 0.75, ra: 112.345, dec: -22.567, koi_kepmag: 11.3, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 10.234, koi_time0bk: 1493.6, koi_impact: 0.19, koi_duration: 3.12, koi_depth: 623.0, koi_prad: 2.34, koi_teq: 689.0, koi_insol: 24.5, koi_model_snr: 66.4, koi_tce_plnt_num: 1, koi_steff: 5450, koi_slogg: 4.44, koi_srad: 0.93, ra: 178.901, dec: 6.789, koi_kepmag: 10.4, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
  { koi_period: 27.345, koi_time0bk: 1571.9, koi_impact: 0.39, koi_duration: 4.78, koi_depth: 212.0, koi_prad: 1.56, koi_teq: 367.0, koi_insol: 2.45, koi_model_snr: 46.2, koi_tce_plnt_num: 1, koi_steff: 4230, koi_slogg: 4.75, koi_srad: 0.64, ra: 301.234, dec: -48.901, koi_kepmag: 11.7, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0 },
];

export async function GET() {
  try {
    // Pick a random entry from the pool
    const randomIndex = Math.floor(Math.random() * TESS_DATA_POOL.length);
    const randomData = TESS_DATA_POOL[randomIndex];

    return NextResponse.json({
      success: true,
      data: randomData,
      rowNumber: 71 + randomIndex, // Simulated row number
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch demo data" },
      { status: 500 }
    );
  }
}