'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function WhyChooseUs() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  const benefits = [
    {
      title: 'Expert Customization',
      description:
        'Every device is custom-built to match your exact specifications and business requirements.',
      icon: '🎨',
    },
    {
      title: 'Proven Reliability',
      description:
        '99.9% uptime guarantee with 24/7 technical support and maintenance.',
      icon: '✅',
    },
    {
      title: 'Scalable Solutions',
      description:
        'Start small and scale up. Our solutions grow with your business needs.',
      icon: '📈',
    },
    {
      title: 'Future-Proof Technology',
      description:
        'Built with the latest IoT standards and cloud integration for long-term viability.',
      icon: '🚀',
    },
    {
      title: 'Dedicated Support',
      description:
        'Personal account managers and technical teams dedicated to your success.',
      icon: '👥',
    },
    {
      title: 'Competitive Pricing',
      description:
        'Premium quality at transparent, competitive rates with flexible payment options.',
      icon: '💰',
    },
  ];

  const promises = [
    'Custom design tailored to your vision',
    'On-time delivery and installation',
    'Comprehensive training and documentation',
    'Ongoing technical support and updates',
    'Quality assurance and testing',
    'Seamless integration with existing systems',
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
          Why Choose Our Products?
        </h2>
        <p className="text-foreground/70 mx-auto max-w-2xl">
          We&apos;re committed to delivering excellence in every aspect of our
          service.
        </p>
      </motion.div>

      {/* Benefits Grid */}
      <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="from-primary/5 to-accent/5 border-border hover:border-primary/40 rounded-xl border bg-gradient-to-br p-6"
          >
            <div className="mb-3 text-4xl">{benefit.icon}</div>
            <h3 className="mb-2 text-lg font-bold">{benefit.title}</h3>
            <p className="text-foreground/70 text-sm">{benefit.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Our Promises */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="from-primary/10 to-accent/10 border-primary/20 rounded-2xl border bg-gradient-to-r p-12"
      >
        <h3 className="mb-8 text-center text-3xl font-bold">What We Promise</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {promises.map((promise, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-start gap-3"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.1,
                }}
                className="bg-primary mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
              >
                <span className="text-primary-foreground text-sm">✓</span>
              </motion.div>
              <span className="text-foreground/80">{promise}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
