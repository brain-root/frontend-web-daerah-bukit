import Hero from '../components/home/Hero';
import FeatureSection from '../components/home/FeatureSection';
import TourismHighlights from '../components/home/TourismHighlights';
import BusinessHighlights from '../components/home/BusinessHighlights';
import EventsPreview from '../components/home/EventsPreview';
import NewsletterSection from '../components/home/NewsletterSection';

const HomePage = () => {
  return (
    <>
      <Hero />
      <FeatureSection />
      <TourismHighlights />
      <BusinessHighlights />
      <EventsPreview />
      <NewsletterSection />
    </>
  );
};

export default HomePage;