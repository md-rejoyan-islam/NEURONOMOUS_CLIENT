'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function CustomDesignServices() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  const services = [
    {
      title: 'Custom Smart Clocks',
      description:
        'Beautifully designed smart clocks with IoT integration, perfect for offices, homes, and educational institutions.',
      features: ['Real-time sync', 'Custom branding', 'IoT connectivity'],
      icon: '🕐',
    },
    {
      title: 'Enterprise IoT Devices',
      description:
        'Tailored IoT solutions designed specifically for your business requirements and operational workflows.',
      features: ['Custom hardware', 'API integration', 'Scalable architecture'],
      icon: '⚙️',
    },
    {
      title: 'Specialized Solutions',
      description:
        'From attendance systems to environmental monitoring, we build exactly what your business needs.',
      features: ['Domain-specific', 'Real-time analytics', 'Cloud integration'],
      icon: '🎯',
    },
  ];

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Custom Design Services
        </h2>
        <p className="text-foreground/70 mx-auto max-w-2xl">
          We don&apos;t just sell products—we create custom solutions tailored
          to your specific business demands and vision.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        {services.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            className="bg-card order-border/40 hover:border-primary/40 rounded-2xl border p-8 transition-all dark:bg-[rgba(41,41,79,0.12)]"
          >
            <div className="mb-4 text-5xl">{service.icon}</div>
            <h3 className="mb-3 text-2xl font-bold">{service.title}</h3>
            <p className="text-foreground/70 mb-6">{service.description}</p>
            <div className="space-y-2">
              {service.features.map((feature, j) => (
                <motion.div
                  key={j}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.1 + j * 0.05 }}
                  className="text-foreground/80 flex items-center gap-2"
                >
                  <span className="bg-primary h-2 w-2 rounded-full" />
                  {feature}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
