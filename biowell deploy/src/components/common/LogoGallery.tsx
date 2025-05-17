import { motion } from 'framer-motion';
import { Activity, Heart, Watch, Brain } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

const LogoGallery = () => {
  const partners = [
    {
      name: 'Apple Health',
      logo: 'https://images.pexels.com/photos/4226122/pexels-photo-4226122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      icon: <Activity className="h-10 w-10 text-blue-500" />,
    },
    {
      name: 'Oura Ring',
      logo: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      icon: <Brain className="h-10 w-10 text-purple-500" />,
    },
    {
      name: 'Garmin',
      logo: 'https://images.pexels.com/photos/4498361/pexels-photo-4498361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      icon: <Watch className="h-10 w-10 text-green-500" />,
    },
    {
      name: 'Fitbit',
      logo: 'https://images.pexels.com/photos/4498482/pexels-photo-4498482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      icon: <Heart className="h-10 w-10 text-red-500" />,
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Trusted Partners</h2>
          <p className="mx-auto max-w-2xl text-text-light">
            We integrate with leading health and fitness devices to provide comprehensive insights.
          </p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group overflow-hidden rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-xl"
            >
              <div className="aspect-square overflow-hidden rounded-lg">
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <ImageWithFallback
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="h-full w-full"
                    objectFit="contain"
                    fallbackComponent={
                      <div className="flex h-full w-full items-center justify-center">
                        {partner.icon}
                      </div>
                    }
                  />
                </div>
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-medium">{partner.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoGallery;