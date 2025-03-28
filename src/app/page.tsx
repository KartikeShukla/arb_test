"use client"

import { Award, Scale, BookOpen, CheckCircle, Gavel, Globe, MessageSquare, Shield, Users, ArrowRight, ExternalLink, Mail, LogOut, Building, Briefcase, Landmark } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { CaseFormModal } from "@/components/case-form/case-form-modal"
import { AuthModal } from "@/components/auth/auth-modal"
import { useAuth } from "@/components/auth/auth-provider"
import Link from "next/link"

// Data constants
const FEATURES = [
  {
    title: "Unbiased Resolution",
    description: "Strict adherence to natural justice ensures fair outcomes, guided by impartiality and equity.",
    icon: <Scale className="h-8 w-8 text-blue-600" />,
  },
  {
    title: "Sector Specialization",
    description: "Deep expertise across diverse industries, from complex tech disputes to large infrastructure projects.",
    icon: <Briefcase className="h-8 w-8 text-blue-600" />,
  },
  {
    title: "Strict Confidentiality",
    description: "Your sensitive business information and reputation are protected through completely private proceedings.",
    icon: <Shield className="h-8 w-8 text-blue-600" />,
  },
  {
    title: "Efficient Timelines",
    description: "Streamlined processes deliver faster resolutions compared to lengthy traditional court litigation.",
    icon: <CheckCircle className="h-8 w-8 text-blue-600" />,
  },
];

const SERVICES = [
  {
    title: "Commercial Disputes",
    description: "Resolving conflicts from contracts, partnerships, and complex business dealings.",
    icon: <Building className="h-8 w-8 text-blue-600" />,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Cross-Border Cases",
    description: "Navigating international standards for disputes involving multiple jurisdictions.",
    icon: <Globe className="h-8 w-8 text-blue-600" />,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Institutional Support",
    description: "Managed proceedings with robust administrative frameworks and clear rules.",
    icon: <Landmark className="h-8 w-8 text-blue-600" />,
    image: "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const TESTIMONIALS = [
  {
    quote: "The arbitration process was handled with exceptional professionalism. We reached a fair resolution in half the time we expected, saving significant resources.",
    author: "Rajiv Sharma",
    position: "CEO, TechSphere Solutions",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    quote: "The arbitrators' industry expertise was invaluable. Their understanding of complex technical issues led to a nuanced and equitable resolution for all parties.",
    author: "Priya Patel",
    position: "Legal Director, Infra Developments",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    quote: "The confidentiality and expedited timeline exceeded our expectations. The platform's support made the entire process seamless and transparent.",
    author: "Vikram Mehta",
    position: "Managing Partner, Global Ventures",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
];

const EXPERTS = [
  {
    name: "Justice (Retd.) Anand Verma",
    specialization: "Commercial & Construction Disputes",
    experience: "35+ years of legal experience",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    name: "Dr. Leela Krishnan",
    specialization: "International Trade & Investment",
    experience: "Former legal advisor to Ministry of Commerce",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    name: "Adv. Rahul Kapoor",
    specialization: "Intellectual Property & Technology",
    experience: "25+ years in IP litigation",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
];

// Reusable component for section headers
const SectionHeader = ({ title, description }: { title: string; description: string }) => (
  <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16 md:mb-20">
    <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl text-gray-900">{title}</h2>
    <p className="max-w-[750px] text-gray-600 text-lg md:text-xl leading-relaxed">
      {description}
    </p>
  </div>
);

export default function Home() {
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { user, signOut, isLoading } = useAuth()

  const openCaseModal = () => setIsCaseModalOpen(true)
  const closeCaseModal = () => setIsCaseModalOpen(false)
  
  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-28 md:py-36 lg:py-48 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=85"
            alt="Abstract legal background"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-6 max-w-4xl">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight">
                Modern Arbitration for <span className="text-blue-400">Efficient Dispute Resolution</span>
              </h1>
              <p className="mx-auto max-w-[850px] text-gray-300 text-lg md:text-xl lg:text-2xl leading-relaxed">
                Leveraging expertise and technology to provide fair, confidential, and timely arbitration services across India and globally.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="text-base font-semibold px-8 py-6 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
                  onClick={openCaseModal}
                >
                  Initiate Your Case <Mail className="ml-2 h-5 w-5" />
                </Button>
                
                {isLoading ? (
                  <div className="h-[60px] w-full sm:w-48 bg-gray-700 animate-pulse rounded-lg"></div>
                ) : user ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/dashboard">
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="text-base font-semibold px-8 py-6 rounded-lg border-gray-400 text-white bg-white/10 hover:bg-white/20 hover:border-white transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
                      >
                        Access Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Button 
                      size="icon" 
                      variant="destructive"
                      className="text-base font-medium px-4 py-6 rounded-lg bg-red-600/90 text-white shadow-lg hover:bg-red-700 transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
                      onClick={signOut}
                      aria-label="Log out"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-base font-semibold px-8 py-6 rounded-lg border-gray-400 text-white bg-white/10 hover:bg-white/20 hover:border-white transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
                    onClick={openAuthModal}
                  >
                    Member Login / Register
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 md:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <SectionHeader 
            title="Core Advantages of Our Platform" 
            description="Experience a modern approach to arbitration that prioritizes fairness, expertise, and efficiency."
          />
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, index) => (
              <Card key={index} className="flex flex-col items-center text-center bg-white border border-gray-200/80 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 transform hover:-translate-y-2">
                <CardHeader className="pb-4">
                  <div className="mb-5 rounded-full bg-blue-100 p-4 w-16 h-16 flex items-center justify-center mx-auto ring-4 ring-blue-100/50">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full py-24 md:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <SectionHeader 
            title="Specialized Arbitration Services" 
            description="Offering tailored dispute resolution across key commercial and international domains."
          />
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-3">
            {SERVICES.map((service, index) => (
              <Card key={index} className="group overflow-hidden bg-white border border-gray-200/80 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>
                <CardHeader className="pt-6 px-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                      {service.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-800">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-6">
                  <p className="text-gray-600 line-clamp-3">{service.description}</p>
                </CardContent>
                <CardFooter className="border-t border-gray-200/80 pt-4 pb-5 px-6 mt-4">
                  <Button variant="link" className="gap-1 p-0 font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    Learn more <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-24 md:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <SectionHeader 
            title="Client Success Stories" 
            description="Hear directly from businesses that have benefited from our efficient and fair arbitration process."
          />
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index} className="bg-white border border-gray-200/80 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-yellow-400">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-6 text-gray-600 italic flex-grow">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-200/80">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-offset-2 ring-blue-200">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.position}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experts Section */}
      <section className="w-full py-24 md:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <SectionHeader 
            title="Meet Our Esteemed Arbitrators" 
            description="A panel of distinguished legal minds and industry veterans committed to justice."
          />
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {EXPERTS.map((expert, index) => (
              <Card key={index} className="group overflow-hidden bg-white border border-gray-200/80 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    fill
                    style={{ objectFit: "cover", objectPosition: "top" }}
                    className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>
                <CardContent className="p-6 relative -mt-16 z-10 bg-white m-4 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900">{expert.name}</h3>
                  <p className="text-blue-600 font-medium mt-1">{expert.specialization}</p>
                  <p className="text-sm text-gray-500 mt-2">{expert.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 md:py-32 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center text-center gap-8">
             <div className="bg-white/10 p-3 rounded-full">
               <Gavel className="h-8 w-8 text-white" />
             </div>
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">Ready to Find Resolution?</h2>
              <p className="text-lg md:text-xl text-blue-100/90 leading-relaxed">
                Start the process today. Submit your case details securely or contact our team for guidance.
              </p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Button 
                size="lg" 
                className="text-base font-semibold px-8 py-6 rounded-lg bg-white text-blue-700 shadow-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
                onClick={openCaseModal}
              >
                Submit Your Case <Mail className="ml-2 h-5 w-5" />
              </Button>
              
              {isLoading ? (
                 <div className="h-[60px] w-full sm:w-56 bg-white/20 animate-pulse rounded-lg"></div>
              ) : user ? (
                <Link href="/dashboard">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-base font-semibold px-8 py-6 rounded-lg border-white/50 text-white bg-white/10 hover:bg-white/20 hover:border-white transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
                  >
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-base font-semibold px-8 py-6 rounded-lg border-white/50 text-white bg-white/10 hover:bg-white/20 hover:border-white transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
                  onClick={openAuthModal}
                >
                  Member Login / Register
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-300 py-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* About */}
            <div className="space-y-4">
               <Link href="/" className="flex items-center gap-2">
                 <Gavel className="h-7 w-7 text-blue-400" />
                 <span className="text-xl font-bold text-white">Arbitration Platform</span>
               </Link>
              <p className="text-sm text-gray-400">
                India's modern hub for efficient, fair, and expert dispute resolution services.
              </p>
              {/* Social Icons Placeholder */}
              <div className="flex gap-3 pt-2">
                {['facebook', 'twitter', 'linkedin', 'instagram'].map(social => (
                  <a key={social} href="#" aria-label={social} className="transition-colors text-gray-400 hover:text-white">
                    <div className="h-9 w-9 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition-colors">
                      {/* Placeholder Icon - Replace with actual icons */}
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"/></svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            {/* Services Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-3 text-sm">
                {['Commercial Arbitration', 'International Arbitration', 'Institutional Arbitration', 'Ad Hoc Arbitration', 'Mediation Services'].map(service => (
                  <li key={service}><a href="#" className="text-gray-400 hover:text-white hover:underline transition-colors">{service}</a></li>
                ))}
              </ul>
            </div>
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                {['About Us', 'Our Experts', 'Case Studies', 'Resources', 'Blog', 'FAQs', 'Privacy Policy', 'Terms of Service'].map(link => (
                  <li key={link}><a href="#" className="text-gray-400 hover:text-white hover:underline transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2 text-gray-400">
                  <MapPinIcon className="h-4 w-4 mt-1 flex-shrink-0 text-blue-400" />
                  <span>112 Arbitration Tower, Law Street, New Delhi, 110001, India</span>
                </li>
                 <li className="flex items-center gap-2">
                   <PhoneIcon className="h-4 w-4 text-blue-400" />
                   <a href="tel:+911234567890" className="text-gray-400 hover:text-white transition-colors">+91 123 456 7890</a>
                 </li>
                 <li className="flex items-center gap-2">
                   <Mail className="h-4 w-4 text-blue-400" />
                   <a href="mailto:info@indianarbitration.com" className="text-gray-400 hover:text-white transition-colors">info@indianarbitration.com</a>
                 </li>
              </ul>
            </div>
          </div>
          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Indian Arbitration Platform. All rights reserved. Designed with care.</p>
          </div>
        </div>
      </footer>

      {/* Case Form Modal */}
      <CaseFormModal isOpen={isCaseModalOpen} onClose={closeCaseModal} />
      
      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  )
}

// Helper icons used in Footer (ensure lucide-react is installed)
import { MapPinIcon, PhoneIcon } from "lucide-react";
