import { NextResponse } from "next/server";

// Feature importance weights based on typical exoplanet detection
const FEATURE_IMPORTANCE: Record<string, number> = {
  koi_model_snr: 0.18,
  koi_fpflag_nt: 0.15,
  koi_depth: 0.12,
  koi_prad: 0.11,
  koi_duration: 0.09,
  koi_period: 0.08,
  koi_impact: 0.07,
  koi_fpflag_ss: 0.06,
  koi_fpflag_co: 0.05,
  koi_teq: 0.04,
  koi_insol: 0.03,
  koi_fpflag_ec: 0.02,
};

// Feature descriptions for explanations
const FEATURE_DESCRIPTIONS: Record<string, { positive: string; negative: string }> = {
  koi_model_snr: {
    positive: "Strong signal-to-noise ratio indicates a clear, consistent transit signature",
    negative: "Weak signal-to-noise ratio suggests potential noise or artifacts in the data",
  },
  koi_fpflag_nt: {
    positive: "No flags for non-transit-like behavior - transit signature appears genuine",
    negative: "Flagged for non-transit-like behavior - may be caused by stellar activity or systematic effects",
  },
  koi_depth: {
    positive: "Transit depth is consistent with planetary size and validates the signal",
    negative: "Unusual transit depth may indicate contamination or blended sources",
  },
  koi_prad: {
    positive: "Planet radius falls within expected range for confirmed exoplanets",
    negative: "Planet radius is outside typical range, suggesting possible false positive",
  },
  koi_duration: {
    positive: "Transit duration matches expectations for orbital configuration",
    negative: "Transit duration inconsistent with expected planetary geometry",
  },
  koi_period: {
    positive: "Orbital period shows stable, repeating transits characteristic of planets",
    negative: "Orbital period inconsistencies suggest potential binary star or other phenomena",
  },
  koi_impact: {
    positive: "Impact parameter indicates favorable geometry for reliable detection",
    negative: "High impact parameter suggests grazing transit, increasing uncertainty",
  },
  koi_fpflag_ss: {
    positive: "No stellar eclipse signature detected - consistent with planetary transit",
    negative: "Possible stellar eclipse detected - may be binary star system",
  },
  koi_fpflag_co: {
    positive: "Centroid analysis shows transit occurs on target star",
    negative: "Centroid offset detected - signal may originate from background source",
  },
  koi_teq: {
    positive: "Equilibrium temperature consistent with planetary properties",
    negative: "Unusual equilibrium temperature for this system configuration",
  },
  koi_insol: {
    positive: "Insolation flux supports planetary interpretation",
    negative: "Extreme insolation flux raises questions about system stability",
  },
  koi_fpflag_ec: {
    positive: "No ephemeris inconsistencies - transits occur on regular schedule",
    negative: "Ephemeris mismatch detected - timing variations suggest complications",
  },
};

export async function POST(request: Request) {
  try {
    const features = await request.json();

    // Calculate a classification score based on multiple factors
    let planetScore = 0.5; // Start neutral

    // High SNR strongly suggests real planet
    const snr = features.koi_model_snr || 0;
    if (snr > 60) planetScore += 0.25;
    else if (snr > 40) planetScore += 0.15;
    else if (snr > 20) planetScore += 0.05;
    else planetScore -= 0.15;

    // False positive flags reduce planet likelihood
    const fpFlags =
      (features.koi_fpflag_nt || 0) +
      (features.koi_fpflag_ss || 0) +
      (features.koi_fpflag_co || 0) +
      (features.koi_fpflag_ec || 0);
    planetScore -= fpFlags * 0.15;

    // Reasonable planet radius (0.5 to 15 Earth radii)
    const radius = features.koi_prad || 0;
    if (radius >= 0.5 && radius <= 15) planetScore += 0.1;
    else planetScore -= 0.1;

    // Transit depth consistency
    const depth = features.koi_depth || 0;
    if (depth > 50 && depth < 5000) planetScore += 0.08;
    else planetScore -= 0.05;

    // Reasonable orbital period (0.5 to 500 days)
    const period = features.koi_period || 0;
    if (period >= 0.5 && period <= 500) planetScore += 0.05;
    else planetScore -= 0.05;

    // Impact parameter (0 to 1 is normal)
    const impact = features.koi_impact || 0;
    if (impact >= 0 && impact <= 1) planetScore += 0.03;

    // Clamp score between 0 and 1
    planetScore = Math.max(0, Math.min(1, planetScore));

    // Determine prediction (threshold at 0.5)
    const isPlanet = planetScore > 0.5;
    const confidence = isPlanet ? planetScore : 1 - planetScore;

    // Calculate feature contributions for SHAP-style explanations
    const contributions: Array<{
      feature: string;
      impact: string;
      magnitude: number;
      value: number;
      description: string;
    }> = [];

    // SNR contribution
    const snrContribution = snr > 40 ? (snr - 40) / 100 : -(40 - snr) / 100;
    contributions.push({
      feature: "koi_model_snr",
      impact: snrContribution > 0 ? "positive" : "negative",
      magnitude: Math.abs(snrContribution * 10),
      value: snr,
      description:
        snrContribution > 0
          ? FEATURE_DESCRIPTIONS.koi_model_snr.positive
          : FEATURE_DESCRIPTIONS.koi_model_snr.negative,
    });

    // False positive flags
    if (fpFlags > 0) {
      contributions.push({
        feature: "koi_fpflag_nt",
        impact: "negative",
        magnitude: fpFlags * 2,
        value: features.koi_fpflag_nt || 0,
        description: FEATURE_DESCRIPTIONS.koi_fpflag_nt.negative,
      });
    } else {
      contributions.push({
        feature: "koi_fpflag_nt",
        impact: "positive",
        magnitude: 1.5,
        value: 0,
        description: FEATURE_DESCRIPTIONS.koi_fpflag_nt.positive,
      });
    }

    // Radius contribution
    const radiusScore = radius >= 0.5 && radius <= 15 ? 1 : -1;
    contributions.push({
      feature: "koi_prad",
      impact: radiusScore > 0 ? "positive" : "negative",
      magnitude: Math.abs(radiusScore * (radius / 5)),
      value: radius,
      description:
        radiusScore > 0
          ? FEATURE_DESCRIPTIONS.koi_prad.positive
          : FEATURE_DESCRIPTIONS.koi_prad.negative,
    });

    // Transit depth
    const depthScore = depth > 50 && depth < 5000 ? 1 : -1;
    contributions.push({
      feature: "koi_depth",
      impact: depthScore > 0 ? "positive" : "negative",
      magnitude: Math.abs(depthScore * Math.log10(depth + 1) / 2),
      value: depth,
      description:
        depthScore > 0
          ? FEATURE_DESCRIPTIONS.koi_depth.positive
          : FEATURE_DESCRIPTIONS.koi_depth.negative,
    });

    // Orbital period
    const periodScore = period >= 0.5 && period <= 500 ? 1 : -1;
    contributions.push({
      feature: "koi_period",
      impact: periodScore > 0 ? "positive" : "negative",
      magnitude: Math.abs(periodScore * Math.log10(period + 1) / 3),
      value: period,
      description:
        periodScore > 0
          ? FEATURE_DESCRIPTIONS.koi_period.positive
          : FEATURE_DESCRIPTIONS.koi_period.negative,
    });

    // Sort by magnitude and take top 5
    contributions.sort((a, b) => b.magnitude - a.magnitude);
    const topContributions = contributions.slice(0, 5);

    return NextResponse.json({
      prediction: isPlanet ? "PLANET" : "FALSE POSITIVE",
      confidence: confidence,
      confidence_percent: (confidence * 100).toFixed(1),
      explanation: topContributions,
    });
  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json(
      { error: "Failed to classify exoplanet" },
      { status: 500 }
    );
  }
}