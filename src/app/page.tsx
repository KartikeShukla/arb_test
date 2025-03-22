import { Award, Scale, BookOpen, CheckCircle, Gavel, Globe, MessageSquare, Shield, Users, ArrowRight, ExternalLink } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

export default function Home() {
  // Features data
  const features = [
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
  ]

  // Services data
  const services = [
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
  ]

  // Testimonials data
  const testimonials = [
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
  ]

  // Experts data
  const experts = [
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
  ]

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
                India's Premier
                <br />
                Arbitration Institution
              </h1>
              <p className="mx-auto max-w-[800px] text-white/90 text-xl md:text-2xl leading-relaxed">
                Resolving complex disputes with impartiality, expertise, and efficiency for businesses across India and beyond.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
                <Button size="lg" className="text-base font-medium px-8 py-6 rounded-md hover:translate-y-[-2px] transition-all">
                  Start Arbitration
                </Button>
                <Button size="lg" variant="outline" className="text-base font-medium px-8 py-6 rounded-md bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:translate-y-[-2px] transition-all">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 md:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-5 text-center mb-16">
            <div className="space-y-3 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Why Choose Our Platform</h2>
              <p className="max-w-[700px] text-muted-foreground text-lg leading-relaxed">
                Our institution combines legal expertise, efficiency, and ethical practices to deliver optimal outcomes.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="flex flex-col items-center text-center border-none shadow-sm hover:shadow-md transition-all duration-300 p-2">
                <CardHeader className="pb-2">
                  <div className="p-4 rounded-full bg-primary/5 mb-5 mx-auto">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full py-24 md:py-32 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-5 text-center mb-16">
            <div className="space-y-3 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our Services</h2>
              <p className="max-w-[700px] text-muted-foreground text-lg leading-relaxed">
                Specialized arbitration services tailored to your specific dispute resolution needs.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-3">
            {services.map((service, index) => (
              <Card key={index} className="flex flex-col overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] h-full">
                <div className="relative h-56 w-full">
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    fill 
                    style={{ objectFit: "cover" }}
                    className="brightness-[0.9]"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    {service.icon}
                    <CardTitle className="font-bold">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-base mb-6 leading-relaxed">{service.description}</CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-primary font-medium hover:bg-primary/5 -ml-3">
                    Learn more <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-24 md:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-5 text-center mb-16">
            <div className="space-y-3 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Client Success Stories</h2>
              <p className="max-w-[700px] text-muted-foreground text-lg leading-relaxed">
                Hear from businesses that have successfully resolved disputes through our platform.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col border-none shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-3px] h-full">
                <CardHeader className="pb-2 relative">
                  <div className="absolute top-0 right-0 w-14 h-14 flex items-center justify-center text-slate-200 opacity-25">
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 pt-4">
                  <p className="mb-8 text-lg leading-relaxed italic text-slate-700">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-slate-100">
                      <Image 
                        src={testimonial.image} 
                        alt={testimonial.author} 
                        fill 
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.author}</p>
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
      <section className="w-full py-24 md:py-32 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-5 text-center mb-16">
            <div className="space-y-3 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Meet Our Expert Arbitrators</h2>
              <p className="max-w-[700px] text-muted-foreground text-lg leading-relaxed">
                Distinguished professionals with decades of experience in complex dispute resolution.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-3">
            {experts.map((expert, index) => (
              <Card key={index} className="flex flex-col border-none shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-3px] overflow-hidden h-full">
                <div className="bg-primary/5 pt-10 pb-5 px-4">
                  <div className="relative mx-auto h-40 w-40 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <Image 
                      src={expert.image} 
                      alt={expert.name} 
                      fill 
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-center text-xl">{expert.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 text-center">
                  <p className="font-medium mb-3 text-primary">{expert.specialization}</p>
                  <p className="text-muted-foreground">{expert.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="CTA background"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-8 text-center max-w-3xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-white">Ready to Resolve Your Dispute?</h2>
              <p className="max-w-[700px] text-white/90 text-lg leading-relaxed">
                Our team of expert arbitrators is ready to help you find an efficient and fair resolution to your complex business disputes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-base font-medium px-8 py-6 rounded-md hover:translate-y-[-2px] transition-all">
                Start Arbitration Process
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-base font-medium px-8 py-6 rounded-md hover:translate-y-[-2px] transition-all">
                Schedule a Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-16 bg-slate-900 text-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Indian Arbitration Platform</h3>
              <p className="text-slate-300 leading-relaxed">
                India's premier institution for fair, efficient, and expert arbitration services.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Services</h3>
              <ul className="space-y-3">
                <li className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Commercial Arbitration</span>
                </li>
                <li className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>International Arbitration</span>
                </li>
                <li className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Institutional Arbitration</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resources</h3>
              <ul className="space-y-3">
                <li className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Arbitration Rules</span>
                </li>
                <li className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Guidelines</span>
                </li>
                <li className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Case Studies</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact</h3>
              <div className="space-y-3">
                <p className="text-slate-300 flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58687 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58687 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3.62001 8.49C5.59001 -0.169998 18.42 -0.159997 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39001 20.54C5.63001 17.88 2.47001 13.57 3.62001 8.49Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span>New Delhi, India</span>
                </p>
                <p className="text-slate-300 flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>contact@indianarbitration.org</span>
                </p>
                <p className="text-slate-300 flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74L9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.31 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10"/>
                  </svg>
                  <span>+91 11 2345 6789</span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-slate-800 pt-10 text-center text-slate-400">
            <p>© 2023 Indian Arbitration Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 