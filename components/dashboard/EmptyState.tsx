import Link from 'next/link'

interface EmptyStateProps {
  title?: string
  description?: string
  showCTA?: boolean
}

export function EmptyState({
  title = "No trips yet",
  description = "Start planning your first adventure!",
  showCTA = true
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-12 text-center">
      <div className="max-w-sm mx-auto">
        {/* Illustration */}
        <div className="text-6xl sm:text-7xl mb-6 animate-bounce">🌍</div>
        
        {/* Content */}
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-8">
          {description}
        </p>
        
        {/* CTA Button */}
        {showCTA && (
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white rounded-full font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
          >
            <span className="text-lg">✨</span>
            Create your first trip
          </Link>
        )}
        
        {/* Secondary info */}
        <p className="text-sm text-gray-500 mt-6">
          Let AI help you plan the perfect itinerary
        </p>
      </div>
    </div>
  )
}
