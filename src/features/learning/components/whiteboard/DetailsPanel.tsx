// src/features/learning/components/whiteboard/DetailsPanel.tsx

import React from "react";
import { DiagramNode } from "@/features/whiteboard/types/whiteboard";
import { cn } from "@/shared/utils/utils";

interface DetailsPanelProps {
  node: DiagramNode | null;
  isOpen: boolean;
  onClose: () => void;
  systemTitle?: string;
  systemDescription?: string;
  scenarioCount?: number;
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
        <div className="sticky top-4">
          {node ? (
            <DetailsPanelContent node={node} onClose={onClose} />
          ) : (
            <DefaultContent 
              systemTitle={systemTitle}
              systemDescription={systemDescription}
              scenarioCount={scenarioCount}
            />
          )}
        </div>
      </div>

      {/* Tablet: Floating panel */}
      <div className="hidden md:block xl:hidden">
        <div className="fixed right-4 top-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto">
          {node ? (
            <DetailsPanelContent node={node} onClose={onClose} />
          ) : (
            <DefaultContent 
              systemTitle={systemTitle}
              systemDescription={systemDescription}
              scenarioCount={scenarioCount}
            />
          )}
        </div>
      </div>

      {/* Mobile: Bottom sheet */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-40">
        <div className="bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 max-h-[70vh] overflow-y-auto">
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
                <DetailsPanelContent node={node} onClose={onClose} isMobile />
              </div>
            </>
          ) : (
            <div className="p-4">
              <DefaultContent 
                systemTitle={systemTitle}
                systemDescription={systemDescription}
                scenarioCount={scenarioCount}
                isMobile
              />
            </div>
          )}
        </div>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={onClose}
        />
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

      {/* Category Legend */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Component Categories
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--category-practice)]" />
            <span className="text-gray-600">Entry Points</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--category-concept)]" />
            <span className="text-gray-600">Logic</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--category-learn-deep)]" />
            <span className="text-gray-600">Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[var(--category-live)]" />
            <span className="text-gray-600">Queues</span>
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
  const CATEGORY_COLORS: Record<string, string> = {
    entry: "var(--category-practice)",
    logic: "var(--category-concept)",
    storage: "var(--category-learn-deep)",
    queue: "var(--category-live)",
    network: "var(--category-neutral)",
  };

  const color = CATEGORY_COLORS[node.category] || "var(--category-neutral)";

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200", !isMobile && "shadow-lg")}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: color }}
          >
            <div className="w-5 h-5 rounded-full border-2 border-current opacity-80" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{node.title}</h3>
            <p className="text-xs text-gray-500 uppercase font-medium">
              {node.category}
            </p>
          </div>
          {!isMobile && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close details"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Role */}
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
            Role
          </span>
          <p className="text-sm text-gray-700 leading-relaxed">
            {node.details.role}
          </p>
        </div>

        {/* Deep Dive */}
        {node.details.deepDive && (
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
              Deep Dive
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">
              {node.details.deepDive}
            </p>
          </div>
        )}

        {/* Failure Modes */}
        {node.details.failureModes && (
          <div>
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wide block mb-1">
              Failure Modes
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">
              {node.details.failureModes}
            </p>
          </div>
        )}

        {/* Tradeoffs */}
        {node.details.tradeoffs && (
          <div>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide block mb-1">
              Tradeoffs
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">
              {node.details.tradeoffs}
            </p>
          </div>
        )}

        {/* Notes */}
        {node.details.notes && (
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide block mb-1">
              Notes
            </span>
            <p className="text-sm text-gray-700 leading-relaxed">
              {node.details.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
