import HomepageFooter from '@/components/homepage/footer';
import HomepageHeader from '@/components/homepage/header';
import HomepageMenuItems from '@/components/homepage/menu-items';
import clsx from 'clsx';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Neuronomous | IoT Platform',
  description:
    'Neuronomous is an advanced IoT platform that enables seamless device management, real-time monitoring, and automation for smart environments for both personal and industrial use cases.',
  openGraph: {
    title: 'Neuronomous | IoT Platform',
    description:
      'Neuronomous is an advanced IoT platform that enables seamless device management, real-time monitoring, and automation for smart environments for both personal and industrial use cases.',
    images: [
      {
        url: '/warning.png',
        width: 1200,
        height: 630,
        alt: 'Neuronomous | IoT Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function App() {
  return (
    <section
      className={clsx(
        'bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#050816] dark:text-slate-200'
      )}
    >
      <div className="absolute inset-0 z-0 [background-image:linear-gradient(to_right,_#e2e8f0_1px,_transparent_1px),linear-gradient(to_bottom,_#e2e8f0_1px,_transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_100%,_#000_60%,_transparent_100%)] [background-size:35px_35px] [-webkit-mask-image:radial-gradient(ellipse_70%_60%_at_50%_100%,_#000_60%,_transparent_100%)] dark:[background-image:linear-gradient(to_right,_#0a172b_1px,_transparent_1px),linear-gradient(to_bottom,_#0b1c36_1px,_transparent_1px)]"></div>
      <HomepageHeader />

      <main>
        <HomepageMenuItems />
      </main>

      <HomepageFooter />
    </section>
  );
}
