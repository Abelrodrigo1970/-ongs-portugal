import Link from 'next/link';
import EventCard from '@/components/EventCard';
import Button from '@/components/ui/Button';
import { Calendar, ArrowRight } from 'lucide-react';

const FeaturedEvents = ({ events = [] }) => {
  if (events.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-green-100 via-green-50 to-emerald-50 p-2">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 p-2">
              Voluntariados para si
            </h2>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {events.slice(0, 4).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mb-8">
            <Link href="/eventos">
              <Button size="lg" className="inline-flex items-center">
                Ver todos os eventos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;

