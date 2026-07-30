// src/features/learning/components/whiteboard/DetailsPanel.tsx

import React from "react";
import { DiagramNode } from "@/features/whiteboard/types/whiteboard";
import { cn } from "@/shared/utils/utils";

const CATEGORY_COLORS = {
  entry: "#FF5A3C",
  logic: "#6A5AE0",
  storage: "#00A87E",
  queue: "#E8940A",
  network: "#15161C",
} as const;

interface DetailsPanelProps {
  node: DiagramNode | null;
  isOpen: boolean;
  onClose: () => void;
  systemTitle?: string;
  systemDescription?: string;
  scenarioCount?: number;
}

function PanelBody({ node, onClose, systemTitle, systemDescription, scenarioCount, isMobile }: {
  node: DiagramNode | null;
  onClose: () => void;
  systemTitle: string;
  systemDescription: string;
  scenarioCount: number;
  isMobile?: boolean;
}) {
  return node ? (
    <DetailsPanelContent node={node} onClose={onClose} isMobile={isMobile} />
  ) : (
    <DefaultContent 
      systemTitle={systemTitle}
      systemDescription={systemDescription}
      scenarioCount={scenarioCount}
      isMobile={isMobile}
    />
  );
}

export function DetailsPanel({ 
  node, 
  isOpen, 
  onClose, 
  systemTitle = "System Architecture",
  systemDescription = "Explore the system architecture by selecting components or starting a guided walkthrough.",
  scenarioCount = 0
}: DetailsPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Desktop: Right sidebar */}
      <div className="hidden xl:block w-[320px] shrink-0">
        <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
          <PanelBody
            node={node}
            onClose={onClose}
            systemTitle={systemTitle}
            systemDescription={systemDescription}
            scenarioCount={scenarioCount}
          />
        </div>
      </div>

      {/* Tablet: Floating panel */}
      <div className="hidden md:block xl:hidden">
        <div className="fixed right-4 top-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto">
          <PanelBody
            node={node}
            onClose={onClose}
            systemTitle={systemTitle}
            systemDescription={systemDescription}
            scenarioCount={scenarioCount}
          />
        </div>
      </div>

      {/* Mobile: Bottom sheet */}
      <div className="md:hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-30 bg-black/20"
          onClick={onClose}
        />
        {/* Sheet */}
        <div className="fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 max-h-[70vh] overflow-y-auto">
          {node ? (
            <>
              <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{node.title}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close details"
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                <PanelBody
                  node={node}
                  onClose={onClose}
                  systemTitle={systemTitle}
                  systemDescription={systemDescription}
                  scenarioCount={scenarioCount}
                  isMobile
                />
              </div>
            </>
          ) : (
            <div className="p-4">
              <PanelBody
                node={node}
                onClose={onClose}
                systemTitle={systemTitle}
                systemDescription={systemDescription}
                scenarioCount={scenarioCount}
                isMobile
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface DefaultContentProps {
  systemTitle: string;
  systemDescription: string;
  scenarioCount: number;
  isMobile?: boolean;
}

function DefaultContent({ 
  systemTitle, 
  systemDescription, 
  scenarioCount, 
  isMobile 
}: DefaultContentProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-200 shadow-lg p-5",
      !isMobile && "p-6"
    )}>
      {/* System Title */}
      <h3 className="font-bold text-lg text-gray-900 mb-2">{systemTitle}</h3>
      
      {/* System Description */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {systemDescription}
      </p>

      {/* Scenario Count */}
      {scenarioCount > 0 && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {scenarioCount}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Guided Scenarios
              </p>
              <p className="text-xs text-blue-600">
                Interactive walkthroughs available
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Start Guide */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Getting Started
        </h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            <span>Select a scenario from the top bar to begin a guided walkthrough</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            <span>Click any component to inspect its role and design decisions</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            <span>Use scroll to pan and scroll wheel to zoom the canvas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DetailsPanelContentProps {
  node: DiagramNode;
  onClose: () => void;
  isMobile?: boolean;
}

function DetailsPanelContent({ node, onClose, isMobile }: DetailsPanelContentProps) {
  const color = CATEGORY_COLORS[node.category as keyof typeof CATEGORY_COLORS] || "#15161C";

  return (
    <div 
      className={cn("bg-white rounded-2xl", !isMobile && "shadow-lg")}
      role="dialog"
      aria-modal="true"
      aria-label={`${node.title} details`}
    >
      {/* Handle for mobile */}
      {isMobile && (
        <div className="w-9 h-1 bg-gray-300 rounded-full mx-auto my-4" />
      )}

      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          <div className="w-4 h-4 rounded-full border-2 border-current opacity-80" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-base">{node.title}</h3>
          <p className="text-xs text-gray-500 font-medium">
            {node.category}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Close details"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 space-y-4">
        {/* What it does */}
        <div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
            What it does
          </span>
          <p className="text-xs text-gray-500 leading-relaxed">
            {node.details.role}
          </p>
        </div>

        {/* Why we need it */}
        {node.details.deepDive && (
          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Why we need it
            </span>
            <p className="text-xs text-gray-500 leading-relaxed">
              {node.details.deepDive}
            </p>
          </div>
        )}

        {/* Failure handling */}
        {node.details.failureModes && (
          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Failure handling
            </span>
            <p className="text-xs text-gray-500 leading-relaxed">
              {node.details.failureModes}
            </p>
          </div>
        )}

        {/* Tradeoffs */}
        {node.details.tradeoffs && (
          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Tradeoffs
            </span>
            <p className="text-xs text-gray-500 leading-relaxed">
              {node.details.tradeoffs}
            </p>
          </div>
        )}

        {/* Notes */}
        {node.details.notes && (
          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Notes
            </span>
            <p className="text-xs text-gray-500 leading-relaxed">
              {node.details.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
