import React from 'react';
import SEO from '../../components/common/SEO';
import HeroBanner from '../../components/home/HeroBanner';
import FeaturedProperties from '../../components/home/FeaturedProperties';
import PartnersMarquee from '../../components/home/PartnersMarquee';
import HomeServices from '../../components/home/HomeServices';
import StatsStrip from '../../components/home/StatsStrip';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import CtaBanner from '../../components/home/CtaBanner';

const Home = () => {
  return (
    <div className="w-full overflow-hidden bg-[var(--color-bg-primary)]">
      <SEO 
        title="HomeSpace | Real Estate & Properties in Gujarat" 
        description="Find your dream home, invest in commercial spaces, or get the best bank auction deals with HomeSpace."
      />
      
      <HeroBanner />
      <FeaturedProperties />
      <PartnersMarquee />
      <HomeServices />
      <StatsStrip />
      <WhyChooseUs />
      <CtaBanner />
      
    </div>
  );
};

export default Home;
