'use client';
import { animate, easeOut, motion, useInView } from 'framer-motion';
import {
  ArrowRightLeft,
  ArrowUpCircle,
  BarChart3,
  BellRing,
  CheckCircle,
  Clock,
  CloudCog,
  LayoutDashboard,
  Lock,
  Megaphone,
  PackagePlus,
  PencilRuler,
  Target,
  UserCheck,
  Wifi,
} from 'lucide-react';
import Image from 'next/image';

import { useEffect, useRef, useState } from 'react';

type CounterProps = {
  from?: number;
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
};

function Counter({
  from = 0,
  to,
  suffix = '',
  duration = 2,
  className,
}: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration,
        ease: 'easeOut',
        onUpdate(value) {
          if (String(to).includes('.')) {
            setDisplayValue(parseFloat(value.toFixed(1)));
          } else {
            setDisplayValue(Math.round(value));
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, from, to, duration]);

  return (
    <p ref={ref} className={className}>
      {displayValue}
      {suffix}
    </p>
  );
}

const HomepageMenuItems = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut, staggerChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };
  return (
    <>
      {/* HERO SECTION */}
      <section
        id="home"
        className="relative bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.1)_0%,transparent_30%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.1)_0%,transparent_30%)] pt-32 pb-20 md:pt-40 md:pb-32 lg:pt-48 dark:bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.2)_0%,transparent_30%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.2)_0%,transparent_30%)]"
      >
        <motion.div
          className="container mx-auto max-w-7xl px-4 text-center sm:px-6"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <motion.h1
            variants={itemVariants}
            className="mb-4 text-4xl leading-tight font-extrabold sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Smart IoT Solutions for{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-teal-500 bg-clip-text text-transparent">
              Modern Education
            </span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mx-auto mb-12 max-w-3xl text-base text-slate-600 sm:text-lg md:text-xl dark:text-slate-400"
          >
            Revolutionize your classroom with our intelligent digital clocks and
            automated attendance systems. Save time, increase efficiency, and
            embrace the future of educational technology.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-12">
            <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-8 text-center md:flex-row md:gap-12 lg:gap-16">
              <div className="flex-1">
                <Counter
                  to={500}
                  suffix="+"
                  className="text-4xl font-bold md:text-5xl"
                />
                <p className="mt-2 text-base text-slate-600 md:text-lg dark:text-slate-400">
                  Devices Deployed
                </p>
              </div>
              <div className="h-px w-2/3 bg-slate-200 md:h-16 md:w-px dark:bg-slate-800/50"></div>
              <div className="flex-1">
                <Counter
                  to={99.9}
                  suffix="%"
                  className="text-4xl font-bold md:text-5xl"
                />
                <p className="mt-2 text-base text-slate-600 md:text-lg dark:text-slate-400">
                  Uptime
                </p>
              </div>
              <div className="h-px w-2/3 bg-slate-200 md:h-16 md:w-px dark:bg-slate-800/50"></div>
              <div className="flex-1">
                <p className="text-4xl font-bold md:text-5xl">24/7</p>
                <p className="mt-2 text-base text-slate-600 md:text-lg dark:text-slate-400">
                  Support
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <motion.section
        id="how-it-works"
        className="py-16 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6">
          <motion.h2
            variants={itemVariants}
            className="mb-4 text-3xl font-bold md:text-4xl"
          >
            Streamline Your Operations in 3 Easy Steps
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto mb-12 max-w-2xl text-slate-600 dark:text-slate-400"
          >
            Our ecosystem is designed for simplicity and power, from device
            installation to daily management.
          </motion.p>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: PackagePlus,
                bg: 'bg-indigo-600/20',
                color: 'text-indigo-400',
                title: '1. Deploy Devices',
                desc: 'Install our WiFi-enabled smart clocks and attendance terminals.',
              },
              {
                icon: CloudCog,
                bg: 'bg-teal-500/20',
                color: 'text-teal-400',
                title: '2. Connect to Cloud',
                desc: 'Devices securely connect to our cloud server via MQTT.',
              },
              {
                icon: LayoutDashboard,
                bg: 'bg-pink-500/20',
                color: 'text-pink-400',
                title: '3. Manage with Ease',
                desc: 'Use our dashboard to manage all your devices from anywhere.',
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  scale: 1.02,
                  boxShadow: '0 10px 20px rgba(20, 184, 166, 0.1)',
                }}
                className="group flex flex-col items-center rounded-xl border border-slate-200 bg-white/60 p-8 text-center backdrop-blur-md transition-all duration-200 hover:border-[#14b8a6] dark:border-slate-600/30 dark:bg-slate-900/50 dark:hover:border-[#14b8a6]"
              >
                <div
                  className={`mb-4 rounded-full p-4 ${item.bg} ${item.color}`}
                >
                  <item.icon className="h-10 w-10 transition-all duration-100 group-hover:-rotate-12" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* IOT SYSTEM */}
      <motion.section
        id="iot-system"
        className="bg-white py-16 md:py-20 dark:bg-slate-900/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6">
          <motion.h2
            variants={itemVariants}
            className="mb-4 text-3xl font-bold md:text-4xl"
          >
            How Our IoT System Works
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto mb-16 max-w-2xl text-slate-600 dark:text-slate-400"
          >
            Seamless integration through secure MQTT communication.
          </motion.p>
          <div className="relative mx-auto flex max-w-5xl flex-col items-center justify-between md:flex-row">
            <div
              className="absolute top-1/2 left-0 hidden h-px w-full -translate-y-1/2 md:block"
              style={{ top: '56px' }}
            >
              <svg width="100%" height="2">
                <line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  strokeWidth="2"
                  className="stroke-slate-200 dark:stroke-slate-800/50"
                  strokeDasharray="8 8"
                />
              </svg>
            </div>
            <div
              className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 md:hidden"
              style={{ height: 'calc(100% - 112px)', top: '56px' }}
            >
              <svg width="2" height="100%">
                <line
                  x1="1"
                  y1="0"
                  x2="1"
                  y2="100%"
                  strokeWidth="2"
                  className="stroke-slate-200 dark:stroke-slate-800/50"
                  strokeDasharray="8 8"
                />
              </svg>
            </div>
            <motion.div
              variants={itemVariants}
              className="z-10 mb-12 flex w-64 flex-col items-center md:mb-0"
            >
              <div className="mb-4 rounded-full border-2 border-blue-500 bg-slate-50 p-5 text-blue-400 dark:bg-[#050816]">
                <Wifi className="h-12 w-12" />
              </div>
              <h3 className="mb-2 text-xl font-bold">WiFi Connection</h3>
              <p className="text-center text-slate-600 dark:text-slate-400">
                Devices connect via ESP32 for reliable communication.
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="z-10 mb-12 flex w-64 flex-col items-center md:mb-0"
            >
              <div className="mb-4 rounded-full border-2 border-purple-500 bg-slate-50 p-5 text-purple-400 dark:bg-[#050816]">
                <ArrowRightLeft className="h-12 w-12" />
              </div>
              <h3 className="mb-2 text-xl font-bold">MQTT Communication</h3>
              <p className="text-center text-slate-600 dark:text-slate-400">
                Secure data transmission using the MQTT protocol.
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="z-10 flex w-64 flex-col items-center"
            >
              <div className="mb-4 rounded-full border-2 border-teal-500 bg-slate-50 p-5 text-teal-400 dark:bg-[#050816]">
                <LayoutDashboard className="h-12 w-12" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Real-time Dashboard</h3>
              <p className="text-center text-slate-600 dark:text-slate-400">
                Monitor, control, and analyze all device data.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FEATURES SECTION */}
      <motion.section
        id="features"
        className="py-16 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Powerful Features, Simple Interface
            </h2>
            <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
              Everything you need to automate and inform.
            </p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Megaphone,
                color: 'text-indigo-400',
                title: 'Dynamic Notice Board',
                desc: 'Instantly switch any smart clock to notice mode. Broadcast announcements to a single device or entire groups.',
              },
              {
                icon: UserCheck,
                color: 'text-teal-400',
                title: 'Automated Attendance',
                desc: 'Capture student attendance seamlessly with RFID cards. Data is instantly saved to your dashboard.',
              },
              {
                icon: BarChart3,
                color: 'text-pink-400',
                title: 'Centralized Dashboard',
                desc: 'A single source of truth. View records, manage devices, and configure settings from one intuitive web interface.',
              },
              {
                icon: ArrowUpCircle,
                color: 'text-yellow-400',
                title: 'Over-the-Air Updates',
                desc: 'Push firmware updates to your devices remotely. Ensure your hardware is always secure and running the latest features.',
              },
              {
                icon: PencilRuler,
                color: 'text-green-400',
                title: 'Manual Data Correction',
                desc: 'Admins can easily view and manually edit attendance records to correct any errors or missed check-ins.',
              },
              {
                icon: Lock,
                color: 'text-sky-400',
                title: 'Secure & Reliable',
                desc: 'Built on the ESP32 platform with robust WiFi and secure MQTT for a stable and responsive IoT network.',
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    boxShadow: '0 10px 20px rgba(20, 184, 166, 0.1)',
                  }}
                  className="group rounded-lg border border-slate-200 bg-white/60 p-6 backdrop-blur-md hover:border-[#14b8a6] dark:border-slate-700/50 dark:bg-slate-900/50 dark:hover:border-[#14b8a6]"
                >
                  <div>
                    <Icon
                      className={`mb-4 h-8 w-8 group-hover:-rotate-12 ${feature.color}`}
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* WHY CHOOSE US */}
      <motion.section
        id="why-choose-us"
        className="relative overflow-hidden py-16 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="absolute inset-0 -skew-y-3 bg-slate-100 dark:bg-slate-900/50"></div>
        <div className="relative container mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div variants={itemVariants}>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Why Choose Our IoT Solutions?
              </h2>
              <p className="mb-8 max-w-lg text-slate-600 dark:text-slate-400">
                Transform your educational environment with smart technology
                designed for efficiency and ease of use.
              </p>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="mr-5 flex-shrink-0 rounded-lg bg-teal-500/20 p-3 text-teal-400">
                    <Clock className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-xl font-bold">
                      Save Teacher Time
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Automated attendance tracking eliminates manual roll
                      calls, saving 10-15 minutes per class.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-5 flex-shrink-0 rounded-lg bg-indigo-500/20 p-3 text-indigo-400">
                    <Target className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-xl font-bold">
                      Increase Accuracy
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Achieve 99.9% accurate attendance tracking with real-time
                      data validation, eliminating human error.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-5 flex-shrink-0 rounded-lg bg-pink-500/20 p-3 text-pink-400">
                    <BellRing className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-xl font-bold">
                      Instant Communication
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Send important notices instantly to all classrooms or
                      offices simultaneously.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="rounded-xl border border-slate-200 bg-white/60 p-4 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/50"
            >
              <Image
                src="/images/classroom.webp"
                width={600}
                height={400}
                alt="A modern, smart classroom"
                className="h-full max-h-[350px] w-full rounded-lg object-cover"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* DEVICES SECTION */}
      <motion.section
        id="devices"
        className="py-16 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div variants={itemVariants}>
              <div className="rounded-xl border border-slate-200 bg-white/60 p-4 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/50">
                <Image
                  src="/images/clock.webp"
                  width={600}
                  height={400}
                  alt="Smart Clock"
                  className="max-h-[300px] w-full rounded-lg object-cover"
                />
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <span className="font-semibold text-teal-400">
                Neuronomous Smart Display
              </span>
              <h2 className="mt-2 mb-4 text-3xl font-bold md:text-4xl">
                More Than Just Time
              </h2>
              <p className="mb-6 text-slate-600 dark:text-slate-400">
                Our Smart Display Clock is a versatile communication tool. By
                default, it shows a clear, synchronized time. Through the
                dashboard, it transforms into a powerful notice board for
                announcements and alerts.
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Dual Mode: Clock & Notice Board
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Remote configuration via web
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  OTA firmware updates
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Scheduled notices
                </li>
              </ul>
            </motion.div>
          </div>
          <div className="mt-16 grid items-center gap-12 md:mt-20 lg:grid-cols-2">
            <motion.div variants={itemVariants} className="lg:order-2">
              <div className="rounded-xl border border-slate-200 bg-white/60 p-4 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/50">
                <Image
                  src="/images/device.webp"
                  alt="Attendance Terminal"
                  width={600}
                  height={400}
                  className="max-h-[300px] w-full rounded-lg object-cover"
                />
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="lg:order-1">
              <span className="font-semibold text-indigo-400">
                Neuronomous Attendance Terminal
              </span>
              <h2 className="mt-2 mb-4 text-3xl font-bold md:text-4xl">
                Attendance, Automated
              </h2>
              <p className="mb-6 text-slate-600 dark:text-slate-400">
                Free your teachers from manual attendance. With a simple tap of
                an RFID card, our terminal securely records student presence and
                sends the data straight to the cloud.
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Instant RFID card reading
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Real-time data sync to dashboard
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Drastically reduces teacher workload
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Manual record correction via web
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CONTACT SECTION */}
      <motion.section
        id="contact"
        className="bg-white py-16 md:py-20 dark:bg-slate-900/50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6">
          <motion.h2
            variants={itemVariants}
            className="mb-4 text-3xl font-bold md:text-4xl"
          >
            Ready to Modernize Your Organization?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto mb-8 max-w-2xl text-slate-600 dark:text-slate-400"
          >
            Let&apos;s talk about how Neuronomous can be tailored to your
            specific needs. Reach out for a personalized demo and pricing
            information.
          </motion.p>
          <motion.div variants={itemVariants}>
            <motion.a
              href="mailto:neuronomous.iot@gmail.com"
              className="inline-block rounded-full bg-indigo-600 px-8 py-3 text-lg font-bold text-white transition hover:bg-indigo-700 md:px-10 md:py-4 md:text-xl"
              whileHover={{
                y: -3,
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
              }}
            >
              Contact Sales
            </motion.a>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
};

export default HomepageMenuItems;
