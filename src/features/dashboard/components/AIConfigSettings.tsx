"use client";

import { useState, useEffect } from "react";

interface AIConfig {
  provider?: "openai" | "ollama" | "custom";
  hasApiKey: boolean;
  model?: string;
  baseUrl?: string;
}

export default function AIConfigSettings() {
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    provider: "ollama" as "openai" | "ollama" | "custom",
    apiKey: "",
    model: "",
    baseUrl: "",
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/user/ai-config");
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
        setFormData({
          provider: data.provider || "ollama",
          apiKey: "",
          model: data.model || "",
          baseUrl: data.baseUrl || "",
        });
      }
    } catch (err) {
      setError("Failed to load AI configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: any = {
        provider: formData.provider,
        model: formData.model || undefined,
        baseUrl: formData.baseUrl || undefined,
      };

      // Only include API key if it's been changed (non-empty)
      if (formData.apiKey) {
        payload.apiKey = formData.apiKey;
      }

      const response = await fetch("/api/user/ai-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save configuration");
      }

      await fetchConfig();
      setFormData(prev => ({ ...prev, apiKey: "" })); // Clear API key field after save
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading AI configuration...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">AI Configuration</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Configure your own AI model and API key. Leave fields empty to use default settings.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            AI Provider
          </label>
          <select
            value={formData.provider}
            onChange={(e) => setFormData({ ...formData, provider: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ollama">Ollama (Local)</option>
            <option value="openai">OpenAI</option>
            <option value="custom">Custom Provider</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key {config?.hasApiKey && "(Already set)"}
          </label>
          <input
            type="password"
            value={formData.apiKey}
            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
            placeholder={config?.hasApiKey ? "Enter new key to update" : "Enter your API key"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your API key is stored securely. Leave empty to keep existing key.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model Name
          </label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="e.g., gpt-4o, qwen3:8b, llama3.2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty to use default model for your provider.
          </p>
        </div>

        {(formData.provider === "ollama" || formData.provider === "custom") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base URL
            </label>
            <input
              type="url"
              value={formData.baseUrl}
              onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
              placeholder={formData.provider === "ollama" ? "http://127.0.0.1:11434" : "https://api.example.com"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.provider === "ollama" 
                ? "Your Ollama instance URL. Default: http://127.0.0.1:11434"
                : "Custom API endpoint URL"}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? "Saving..." : "Save Configuration"}
        </button>
      </form>

      {config && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Current Configuration</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Provider:</span> {config.provider || "Default"}</p>
            <p><span className="font-medium">API Key:</span> {config.hasApiKey ? "✓ Configured" : "Not set"}</p>
            <p><span className="font-medium">Model:</span> {config.model || "Default"}</p>
            <p><span className="font-medium">Base URL:</span> {config.baseUrl || "Default"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
