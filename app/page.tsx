import HomepageFooter from '@/components/homepage/footer';
import HomepageHeader from '@/components/homepage/header';
import HomepageMenuItems from '@/components/homepage/menu-items';
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
    <section className="bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#050816] dark:text-slate-200">
      <HomepageHeader />

      <main>
        <HomepageMenuItems />
      </main>

      <HomepageFooter />
    </section>
  );
}
