import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import SEO from '../../components/common/SEO';
import SectionHeading from '../../components/ui/SectionHeading';
import PartnersMarquee from '../../components/home/PartnersMarquee';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { Building2, Users, MapPin, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import aboutHeroImg from '../../assets/about-hero.jpg';

const About = () => {
  const [stats, setStats] = useState({
    properties: '10,000+',
    partners: '50+',
    experience: '15+',
    clients: '15,000+'
  });

  useEffect(() => {
    // Attempt to fetch real stats if the endpoint is public/available
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        if (data && data.data) {
          setStats(prev => ({
            ...prev,
            properties: data.data.totalProperties || prev.properties,
            partners: data.data.activePartners || prev.partners,
          }));
        }
      } catch (error) {
        console.log('Using fallback placeholder stats for About page.');
      }
    };
    fetchStats();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const team = [
    { name: "Rajesh Patel", role: "Founder & CEO", image: "https://ui-avatars.com/api/?name=Rajesh+Patel&background=0F4C81&color=fff&size=256" },
    { name: "Anita Desai", role: "Head of Operations", image: "https://ui-avatars.com/api/?name=Anita+Desai&background=b5952f&color=fff&size=256" },
    { name: "Vikram Singh", role: "Chief Financial Advisor", image: "https://ui-avatars.com/api/?name=Vikram+Singh&background=0F4C81&color=fff&size=256" },
    { name: "Neha Sharma", role: "Lead Consultant", image: "https://ui-avatars.com/api/?name=Neha+Sharma&background=b5952f&color=fff&size=256" }
  ];

  const whyChooseUs = [
    "End-to-end loan sanctioning and disbursement from the comfort of your home.",
    "Unbiased professional advice to find the lowest interest rates.",
    "Zero-cost doorstep service, saving your time and energy.",
    "Exclusive insights into upcoming housing projects across Gujarat."
  ];

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen pt-24 font-sans overflow-x-hidden">
      <SEO title="About Us | Real Estate" description="Learn about our mission to simplify your real estate and investment journey." />

      {/* Hero Section */}
      <section className="relative bg-slate-950 py-24 lg:py-32 overflow-hidden text-white">
        <div className="absolute inset-0">
          <img 
            src={aboutHeroImg} 
            alt="About Real Estate" 
            className="w-full h-full object-cover object-center md:object-right brightness-105 contrast-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/25 md:to-transparent" />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold text-sm tracking-widest uppercase mb-6 backdrop-blur-md shadow-sm">
                About Us
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight drop-shadow-lg">
                Your Goals. <br className="hidden md:block" /><span className="text-[#f5c242] drop-shadow-md">Our Commitment.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-xl drop-shadow">
                Trusted real estate partner for today and tomorrow. Navigating the complexities of real estate investments and financial freedom.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Story (2-Column) */}
      <section className="py-24 bg-white border-b border-[var(--color-border-subtle)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative h-[500px] rounded-[32px] overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80" 
                alt="Modern Architecture" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/95 backdrop-blur px-6 py-4 rounded-xl border-l-4 border-[var(--color-secondary)]">
                  <p className="text-[var(--color-primary)] font-bold text-lg italic">
                    "For us, you are not just a customer; you are a partner whose interests we fiercely protect."
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SectionHeading 
                title="Our Story" 
                subtitle="A Legacy of Trust and Transparency" 
                align="left"
              />
              <div className="mt-8 space-y-6 text-[16px] text-[var(--color-text-secondary)] leading-relaxed">
                <p>
                  For over 15 years, HomeSpace has operated as a premier facilitator bridging the gap between ambitious property seekers and top-tier financial institutions. Based in Ahmedabad, Gujarat, our reach extends across India and to NRIs globally.
                </p>
                <p>
                  We aggregate details—interest rates, processing fees, terms, and legal requirements—from multiple banks into a single point of contact. This means you get unbiased, transparent advice to choose the loan or property that is genuinely best for you, without incurring hidden costs.
                </p>
                <div className="bg-[var(--color-bg-secondary)] p-6 rounded-2xl border border-[var(--color-border-subtle)] mt-8">
                  <h4 className="font-bold text-[var(--color-text-primary)] mb-4 text-lg">The HomeSpace Advantage</h4>
                  <ul className="space-y-3">
                    {whyChooseUs.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle2 size={20} className="text-[var(--color-secondary)] mr-3 shrink-0 mt-0.5" />
                        <span className="text-[15px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[var(--color-bg-secondary)] relative z-10 -mt-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card padding="p-8" hover className="text-center bg-white">
              <Building2 size={40} className="mx-auto text-[var(--color-primary)] mb-4" />
              <div className="text-4xl font-extrabold text-[var(--color-text-primary)] mb-2">{stats.properties}</div>
              <div className="text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Properties Managed</div>
            </Card>
            <Card padding="p-8" hover className="text-center bg-white">
              <Award size={40} className="mx-auto text-[var(--color-secondary)] mb-4" />
              <div className="text-4xl font-extrabold text-[var(--color-text-primary)] mb-2">{stats.experience}</div>
              <div className="text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Years Experience</div>
            </Card>
            <Card padding="p-8" hover className="text-center bg-white">
              <Users size={40} className="mx-auto text-[var(--color-primary)] mb-4" />
              <div className="text-4xl font-extrabold text-[var(--color-text-primary)] mb-2">{stats.clients}</div>
              <div className="text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Satisfied Clients</div>
            </Card>
            <Card padding="p-8" hover className="text-center bg-white">
              <MapPin size={40} className="mx-auto text-[var(--color-secondary)] mb-4" />
              <div className="text-4xl font-extrabold text-[var(--color-text-primary)] mb-2">{stats.partners}</div>
              <div className="text-[13px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">Bank Partners</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white border-t border-[var(--color-border-subtle)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading 
            title="Meet the Leadership" 
            subtitle="The visionaries and experts driving HomeSpace forward."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {team.map((member, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-[24px] mb-6 aspect-[4/5] bg-gray-100 shadow-soft">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] text-center group-hover:text-[var(--color-primary)] transition-colors">{member.name}</h3>
                <p className="text-[var(--color-text-secondary)] font-medium text-center text-[14px] mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bank Partners */}
      <section className="py-20 bg-[var(--color-bg-secondary)] border-t border-b border-[var(--color-border-subtle)] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 mb-10 text-center">
          <h3 className="text-lg font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Our Trusted Network</h3>
        </div>
        <PartnersMarquee />
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-[var(--color-primary)] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/connected.png')]"></div>
        <div className="max-w-[800px] mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Ready to Experience the Best?</h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Whether you are buying your first home or liquidating a commercial asset, our team is ready to deliver results.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-[var(--color-secondary)] hover:bg-[#b5952f] text-white border-none shadow-xl px-12">
              Let's Talk <ArrowRight size={18} className="ml-2 inline" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default About;
