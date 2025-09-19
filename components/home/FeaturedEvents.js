import Link from 'next/link';
import EventCard from '@/components/EventCard';
import Button from '@/components/ui/Button';
import { Calendar, ArrowRight } from 'lucide-react';

const FeaturedEvents = ({ events = [] }) => {
  if (events.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Eventos em Destaque
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descobre oportunidades de voluntariado próximas de ti e faz parte da mudança
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.slice(0, 6).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Button
              as={Link}
              href="/eventos"
              size="lg"
              className="inline-flex items-center"
            >
              Ver todos os eventos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;

