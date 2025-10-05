"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Feature {
  name: string;
  value: number;
}

interface ShapExplanation {
  feature: string;
  impact: string;
  magnitude: number;
  value: number;
  description: string;
}

interface PredictionResult {
  prediction: string;
  confidence: number;
  confidence_percent: string;
  explanation: ShapExplanation[];
}

const FEATURE_LABELS: Record<string, string> = {
  koi_period: "Orbital Period (days)",
  koi_time0bk: "Transit Epoch (BKJD)",
  koi_impact: "Impact Parameter",
  koi_duration: "Transit Duration (hours)",
  koi_depth: "Transit Depth (ppm)",
  koi_prad: "Planet Radius (Earth radii)",
  koi_teq: "Equilibrium Temperature (K)",
  koi_insol: "Insolation Flux (Earth flux)",
  koi_model_snr: "Signal-to-Noise Ratio",
  koi_tce_plnt_num: "TCE Planet Number",
  koi_steff: "Stellar Temperature (K)",
  koi_slogg: "Stellar Surface Gravity",
  koi_srad: "Stellar Radius (Solar radii)",
  ra: "Right Ascension (deg)",
  dec: "Declination (deg)",
  koi_kepmag: "Kepler Magnitude",
  koi_fpflag_nt: "Not Transit-Like Flag",
  koi_fpflag_ss: "Stellar Eclipse Flag",
  koi_fpflag_co: "Centroid Offset Flag",
  koi_fpflag_ec: "Ephemeris Match Flag",
};

export default function ExoNetClassifier() {
  const [features, setFeatures] = useState<Record<string, number>>({});
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<{
    connected: boolean;
    message: string;
  }>({ connected: false, message: "Checking..." });
  const [activeTab, setActiveTab] = useState("input");
  const [loadingDemo, setLoadingDemo] = useState(false);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch("/api/health");
      if (response.ok) {
        const data = await response.json();
        setBackendStatus({
          connected: true,
          message: `${data.service} ready`,
        });
      } else {
        setBackendStatus({
          connected: false,
          message: "Service unavailable",
        });
      }
    } catch (err) {
      setBackendStatus({
        connected: false,
        message: "Connection failed",
      });
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFeatures((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const loadDemoData = async () => {
    setLoadingDemo(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch("/api/demo-data");
      
      if (!response.ok) {
        throw new Error("Failed to load demo data");
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setFeatures(result.data);
        console.log(`Loaded demo data from row ${result.rowNumber}`);
      } else {
        throw new Error("Invalid demo data response");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load demo data");
    } finally {
      setLoadingDemo(false);
    }
  };

  const clearForm = () => {
    setFeatures({});
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(features),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Classification failed");
      }

      const data = await response.json();
      setResult(data);
      
      // Auto-switch to Results tab and scroll to top
      setActiveTab("results");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-light tracking-tight text-white mb-3">
          ExoNET
        </h1>
        <p className="text-xl text-gray-400 font-light">Starlight, Decoded</p>
        
        {/* Status indicator */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          <div
            className={`w-2 h-2 rounded-full ${
              backendStatus.connected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-gray-400">{backendStatus.message}</span>
          <button
            onClick={checkBackendHealth}
            className="ml-2 text-gray-500 hover:text-white transition-colors text-xs"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Main content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/5">
          <TabsTrigger value="input">Input Features</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Action buttons */}
              <div className="flex gap-3 mb-8">
                <button
                  type="button"
                  onClick={loadDemoData}
                  disabled={loadingDemo}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 text-sm font-light border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingDemo ? "Loading..." : "Load a Data"}
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all duration-200 text-sm font-light border border-white/10"
                >
                  Clear Form
                </button>
              </div>

              {/* Feature inputs grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(FEATURE_LABELS).map(([name, label]) => (
                  <div key={name} className="space-y-1.5">
                    <label className="block text-sm text-gray-300 font-light">
                      {label}
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={features[name] || ""}
                      onChange={(e) => handleInputChange(name, e.target.value)}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                      placeholder="0.0"
                    />
                  </div>
                ))}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !backendStatus.connected}
                className="w-full py-3.5 bg-white hover:bg-gray-100 text-black rounded-lg font-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                {loading ? "Classifying..." : "Classify Exoplanet"}
              </button>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}
            </form>
          </div>
        </TabsContent>

        <TabsContent value="results">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            {result ? (
              <div className="space-y-8">
                {/* Prediction result */}
                <div className="text-center p-8 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-sm text-gray-400 font-light mb-2">
                    Classification
                  </div>
                  <div
                    className={`text-4xl font-light mb-3 ${
                      result.prediction === "PLANET"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {result.prediction}
                  </div>
                  <div className="text-2xl text-gray-300 font-light">
                    {result.confidence_percent}% confidence
                  </div>
                </div>

                {/* Explanations */}
                <div className="space-y-4">
                  <h3 className="text-xl text-white font-light">
                    Key Features Driving This Classification
                  </h3>
                  <div className="space-y-3">
                    {result.explanation.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-white font-light">
                            {FEATURE_LABELS[item.feature] || item.feature}
                          </span>
                          <span
                            className={`text-sm px-2 py-1 rounded ${
                              item.impact === "positive"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {item.impact === "positive" ? "Positive" : "Negative"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 font-light">
                          {item.description}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Value: {item.value.toFixed(3)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p className="text-lg font-light mb-2">No results yet</p>
                <p className="text-sm">
                  Submit the form to classify an exoplanet candidate
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}