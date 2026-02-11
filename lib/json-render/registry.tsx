'use client';

/**
 * TripGenie json-render Component Registry
 *
 * Maps each catalog entry to a real React component. The renderer will
 * only instantiate components listed here, providing a strict allow-list
 * so AI output can never inject arbitrary markup.
 */

import React, { useState } from 'react';
import { defineRegistry, type ComponentProps } from '@json-render/react';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  ExternalLink,
  Lightbulb,
  MapPin,
  Moon,
  Sunrise,
  Sun,
  Utensils,
} from 'lucide-react';
import { tripCatalog } from './catalog';

// ── Helpers ────────────────────────────────────────────────────────────
function formatCost(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

const categoryEmojis: Record<string, string> = {
  sightseeing: '\u{1F440}',
  adventure: '\u{1F3D4}\u{FE0F}',
  cultural: '\u{1F3DB}\u{FE0F}',
  relaxation: '\u{1F9D8}',
  entertainment: '\u{1F3AD}',
  shopping: '\u{1F6CD}\u{FE0F}',
};

const mealTypeEmojis: Record<string, string> = {
  breakfast: '\u{1F373}',
  lunch: '\u{1F957}',
  dinner: '\u{1F37D}\u{FE0F}',
  snack: '\u{2615}',
};

const periodIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  morning: {
    icon: <Sunrise className="w-4 h-4" />,
    color: 'bg-amber-100 text-amber-700',
  },
  afternoon: {
    icon: <Sun className="w-4 h-4" />,
    color: 'bg-orange-100 text-orange-700',
  },
  evening: {
    icon: <Moon className="w-4 h-4" />,
    color: 'bg-indigo-100 text-indigo-700',
  },
};

// ── Registry ───────────────────────────────────────────────────────────
export const { registry } = defineRegistry(tripCatalog, {
  components: {
    // ─── TripOverview ────────────────────────────────────────────────
    TripOverview: ({ props }: ComponentProps<typeof tripCatalog, 'TripOverview'>) => (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 animate-in fade-in duration-500">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Trip Overview</h2>
        <p className="text-sm text-gray-500 mb-3">
          {formatDate(props.startDate)} &ndash; {formatDate(props.endDate)}
        </p>
        <p className="text-gray-600">{props.overview}</p>
        {props.totalCost != null && props.currency && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <DollarSign className="w-4 h-4" />
            <span>Estimated total: {formatCost(props.totalCost, props.currency)}</span>
          </div>
        )}
      </div>
    ),

    // ─── ItineraryDay ────────────────────────────────────────────────
    ItineraryDay: ({ props, children }: ComponentProps<typeof tripCatalog, 'ItineraryDay'>) => {
      const [expanded, setExpanded] = useState(props.dayNumber === 1);

      return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex flex-col items-center justify-center text-white flex-shrink-0">
                <span className="text-xs font-medium uppercase leading-none">Day</span>
                <span className="text-lg sm:text-xl font-bold leading-none">{props.dayNumber}</span>
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">{formatDate(props.date)}</p>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {props.title}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {props.totalCost != null && props.currency && (
                <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatCost(props.totalCost, props.currency)}</span>
                </div>
              )}
              {expanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </button>

          {expanded && (
            <div className="px-4 sm:px-6 pb-6 border-t border-gray-100">
              <p className="text-gray-600 text-sm mt-4 mb-6">{props.summary}</p>
              {children}
              {/* Mobile cost */}
              {props.totalCost != null && props.currency && (
                <div className="sm:hidden mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Day total</span>
                  <span className="font-semibold text-gray-900">
                    {formatCost(props.totalCost, props.currency)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      );
    },

    // ─── TimeBlock ───────────────────────────────────────────────────
    TimeBlock: ({ props, children }: ComponentProps<typeof tripCatalog, 'TimeBlock'>) => {
      const cfg = periodIcons[props.period] ?? periodIcons.morning;
      const label = props.period.charAt(0).toUpperCase() + props.period.slice(1);

      return (
        <div className="mb-6 last:mb-0">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${cfg.color}`}>
              {cfg.icon}
            </div>
            <h4 className="font-semibold text-gray-800">{label}</h4>
          </div>
          <div className="space-y-3 ml-9">{children}</div>
        </div>
      );
    },

    // ─── ActivityCard ────────────────────────────────────────────────
    ActivityCard: ({ props }: ComponentProps<typeof tripCatalog, 'ActivityCard'>) => (
      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow animate-in fade-in duration-300">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-sm">
            {categoryEmojis[props.category] || '\u{1F4CD}'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900 truncate">{props.name}</h4>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{props.description}</p>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(props.duration)}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                {formatCost(props.costAmount, props.currency)}
              </span>
              {props.locationAddress && (
                <span className="flex items-center gap-1 truncate max-w-[150px]">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{props.locationName}</span>
                </span>
              )}
            </div>

            {props.matchedVibes && props.matchedVibes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {props.matchedVibes.slice(0, 3).map((vibe) => (
                  <span
                    key={vibe}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700"
                  >
                    {vibe}
                  </span>
                ))}
              </div>
            )}

            {props.requiresReservation && (
              <div className="mt-2">
                {props.bookingUrl ? (
                  <a
                    href={props.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-600 font-medium"
                  >
                    Book now <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-amber-600 font-medium">
                    Reservation recommended
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    ),

    // ─── RestaurantCard ──────────────────────────────────────────────
    RestaurantCard: ({ props }: ComponentProps<typeof tripCatalog, 'RestaurantCard'>) => (
      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow animate-in fade-in duration-300">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
            <Utensils className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{mealTypeEmojis[props.mealType] || '\u{1F37D}\u{FE0F}'}</span>
              <h4 className="font-semibold text-gray-900 truncate">{props.name}</h4>
              <span className="text-xs text-gray-400 font-medium">
                {'$'.repeat(props.priceLevel)}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{props.description}</p>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                {formatCost(props.costAmount, props.currency)}
                {props.perPerson && '/person'}
              </span>
              {props.locationAddress && (
                <span className="flex items-center gap-1 truncate max-w-[150px]">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{props.locationName}</span>
                </span>
              )}
            </div>

            {props.cuisineTypes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {props.cuisineTypes.slice(0, 3).map((cuisine) => (
                  <span
                    key={cuisine}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>
            )}

            {props.reservationRecommended && (
              <div className="mt-2">
                {props.reservationUrl ? (
                  <a
                    href={props.reservationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-600 font-medium"
                  >
                    Make reservation <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-amber-600 font-medium">
                    Reservation recommended
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    ),

    // ─── TipsList ────────────────────────────────────────────────────
    TipsList: ({ props }: ComponentProps<typeof tripCatalog, 'TipsList'>) => (
      <div className="mt-6 p-4 bg-primary-50 rounded-xl animate-in fade-in duration-500">
        <div className="flex items-center gap-2 text-primary-700 font-medium mb-2">
          <Lightbulb className="w-4 h-4" />
          <span>{props.title}</span>
        </div>
        <ul className="space-y-1">
          {props.tips.map((tip, i) => (
            <li key={i} className="text-sm text-primary-700 flex items-start gap-2">
              <span className="text-primary-400">&bull;</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    ),

    // ─── PackingList ─────────────────────────────────────────────────
    PackingList: ({ props }: ComponentProps<typeof tripCatalog, 'PackingList'>) => (
      <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-in fade-in duration-500">
        <h3 className="font-semibold text-gray-900 mb-3">Packing Suggestions</h3>
        <div className="flex flex-wrap gap-2">
          {props.items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    ),

    // ─── CostSummary ─────────────────────────────────────────────────
    CostSummary: ({ props }: ComponentProps<typeof tripCatalog, 'CostSummary'>) => (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-in fade-in duration-500">
        <h3 className="font-semibold text-gray-900 mb-3">Cost Summary</h3>
        {props.breakdown && props.breakdown.length > 0 && (
          <ul className="space-y-2 mb-4">
            {props.breakdown.map((row, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{row.label}</span>
                <span className="font-medium text-gray-900">
                  {formatCost(row.amount, props.currency)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-primary">
            {formatCost(props.totalAmount, props.currency)}
          </span>
        </div>
      </div>
    ),

    // ─── Section ─────────────────────────────────────────────────────
    Section: ({ props, children }: ComponentProps<typeof tripCatalog, 'Section'>) => (
      <div className="space-y-4 animate-in fade-in duration-500">
        <h2 className="text-lg font-semibold text-gray-900">{props.title}</h2>
        {children}
      </div>
    ),
  },
});
