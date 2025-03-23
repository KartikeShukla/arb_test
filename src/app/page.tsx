"use client"

import { Award, Scale, BookOpen, CheckCircle, Gavel, Globe, MessageSquare, Shield, Users, ArrowRight, ExternalLink, Mail } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useState } from "react"
import { CaseFormModal } from "@/components/case-form/case-form-modal"

// Data constants
const FEATURES = [
  {
    title: "Fair & Impartial",
    description: "Our arbitrators deliver unbiased resolutions with strict adherence to principles of natural justice and equity.",
    icon: <Scale className="h-8 w-8 text-primary" />,
  },
  {
    title: "Industry Expertise",
    description: "Access to arbitrators with deep knowledge in specialized sectors, from technology to infrastructure.",
    icon: <BookOpen className="h-8 w-8 text-primary" />,
  },
  {
    title: "Confidential Process",
    description: "Complete privacy for all proceedings, safeguarding your sensitive business information and reputation.",
    icon: <Shield className="h-8 w-8 text-primary" />,
  },
  {
    title: "Time-Efficient",
    description: "Structured processes that deliver resolutions in a fraction of the time compared to traditional litigation.",
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
  },
];

const SERVICES = [
  {
    title: "Commercial Arbitration",
    description: "Expert resolution of disputes arising from contracts, partnerships, and business relationships.",
    icon: <Gavel className="h-8 w-8 text-primary" />,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "International Arbitration",
    description: "Specialized cross-border dispute resolution following international standards and protocols.",
    icon: <Globe className="h-8 w-8 text-primary" />,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Institutional Arbitration",
    description: "Structured proceedings with comprehensive administrative support and transparent procedures.",
    icon: <Award className="h-8 w-8 text-primary" />,
    image: "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
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
  <div className="flex flex-col items-center justify-center space-y-5 text-center mb-16">
    <div className="space-y-3 max-w-3xl">
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      <p className="max-w-[700px] text-muted-foreground text-lg leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=85"
            alt="Arbitration background"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
            className="brightness-[0.75]"
          />
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-6 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white">
                India's Premier<br />Arbitration Institution
              </h1>
              <p className="mx-auto max-w-[800px] text-white/90 text-xl md:text-2xl leading-relaxed">
                Resolving complex disputes with impartiality, expertise, and efficiency for businesses across India and beyond.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
                <Button 
                  size="lg" 
                  className="text-base font-medium px-8 py-6 rounded-md bg-blue-600 text-white hover:bg-blue-700 hover:translate-y-[-2px] transition-all"
                  onClick={openModal}
                >
                  Get Started with Your Case <Mail className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 md:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <SectionHeader 
            title="Why Choose Our Platform" 
            description="Our institution combines legal expertise, efficiency, and ethical practices to deliver optimal outcomes."
          />
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, index) => (
              <Card key={index} className="flex flex-col items-center text-center border-none shadow-sm hover:shadow-md transition-all duration-300 p-2">
                <CardHeader className="pb-2">
                  <div className="mb-4 rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full py-24 md:py-32 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <SectionHeader 
            title="Our Arbitration Services" 
            description="Comprehensive dispute resolution solutions tailored to your specific needs."
          />
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-3">
            {SERVICES.map((service, index) => (
              <Card key={index} className="overflow-hidden bg-white border-none shadow-md hover:shadow-lg hover:scale-[1.02] transition-all">
                <div className="relative h-48 w-full">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500"
                  />
                </div>
                <CardHeader className="pt-6">
                  <div className="flex items-center gap-3">
                    {service.icon}
                    <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="ghost" className="gap-1 p-0 font-medium text-primary hover:text-primary/80">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-24 md:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <SectionHeader 
            title="What Our Clients Say" 
            description="Discover how our arbitration services have helped businesses resolve complex disputes efficiently."
          />
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-yellow-500">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-6 text-muted-foreground italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experts Section */}
      <section className="w-full py-24 md:py-32 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <SectionHeader 
            title="Our Arbitration Experts" 
            description="Experienced professionals dedicated to delivering fair and efficient dispute resolution."
          />
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
            {EXPERTS.map((expert, index) => (
              <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-lg hover:scale-[1.02] transition-all">
                <div className="relative h-64 w-full">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold">{expert.name}</h3>
                  <p className="text-primary font-medium">{expert.specialization}</p>
                  <p className="text-sm text-muted-foreground mt-1">{expert.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 md:py-32 bg-primary text-white">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ready to Resolve Your Dispute?</h2>
              <p className="text-xl text-white/90">
                Our team of expert arbitrators is ready to help you reach a fair and efficient resolution.
              </p>
            </div>
            <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
              <Button 
                size="lg" 
                className="text-base font-medium px-8 py-6 rounded-md bg-blue-600 text-white hover:bg-blue-700 hover:translate-y-[-2px] transition-all"
                onClick={openModal}
              >
                Get Started with Your Case <Mail className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-neutral-900 text-white py-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-xl font-bold mb-4">Indian Arbitration Platform</h3>
              <p className="text-sm text-white/70 mb-6">
                Leading dispute resolution services for businesses across India and beyond.
              </p>
              <div className="flex gap-4">
                {['facebook', 'twitter', 'linkedin', 'instagram'].map(social => (
                  <a key={social} href="#" className="transition-colors text-white/70 hover:text-white">
                    <span className="sr-only">{social}</span>
                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <ul className="space-y-3 text-sm">
                {['Commercial Arbitration', 'International Arbitration', 'Institutional Arbitration', 'Ad Hoc Arbitration', 'Mediation Services'].map(service => (
                  <li key={service}><a href="#" className="text-white/70 hover:text-white transition-colors">{service}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                {['About Us', 'Our Experts', 'Case Studies', 'Resources', 'Blog', 'FAQs'].map(link => (
                  <li key={link}><a href="#" className="text-white/70 hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="text-white/70">112 Arbitration Tower, Law Street</li>
                <li className="text-white/70">New Delhi, 110001</li>
                <li><a href="tel:+911234567890" className="text-white/70 hover:text-white transition-colors">+91 123 456 7890</a></li>
                <li><a href="mailto:info@indianarbitration.com" className="text-white/70 hover:text-white transition-colors">info@indianarbitration.com</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm text-white/50">
            <p>© {new Date().getFullYear()} Indian Arbitration Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Case Form Modal */}
      <CaseFormModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
} 