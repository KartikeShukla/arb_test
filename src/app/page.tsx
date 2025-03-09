import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  CheckCircle2,
  Shield,
  Users,
  Zap,
  Scale,
  FileText,
  Calendar,
  BarChart,
} from "lucide-react";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Comprehensive Case Management
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform streamlines the entire arbitration process with
              powerful tools for administrators, arbitrators, and legal
              representatives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Scale className="w-6 h-6" />,
                title: "Streamlined Workflow",
                description:
                  "End-to-end case management from filing to enforcement",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Secure Document Repository",
                description: "Version control and digital signatures",
              },
              {
                icon: <Calendar className="w-6 h-6" />,
                title: "Integrated Scheduling",
                description: "Hearings, deadlines and video conferencing",
              },
              {
                icon: <BarChart className="w-6 h-6" />,
                title: "Advanced Analytics",
                description: "Comprehensive reporting and insights",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-based Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tailored For Every Role</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dedicated interfaces designed for the specific needs of each user
              type in the arbitration process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: "Administrators",
                description:
                  "Complete oversight of all cases, system configuration, and comprehensive analytics to optimize institutional operations.",
                features: [
                  "Case creation and assignment",
                  "Workflow template configuration",
                  "Resource allocation tracking",
                  "Performance analytics",
                ],
              },
              {
                icon: <Scale className="w-8 h-8" />,
                title: "Arbitrators",
                description:
                  "Efficient tools to manage assigned cases, review documents, and conduct proceedings with maximum effectiveness.",
                features: [
                  "Case dashboard with priorities",
                  "Document review queue",
                  "Hearing management",
                  "Award drafting assistance",
                ],
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "Legal Representatives",
                description:
                  "Secure access to case materials, deadline tracking, and streamlined document submission for client representation.",
                features: [
                  "Document repository access",
                  "Submission deadline alerts",
                  "Hearing scheduling",
                  "Client case status updates",
                ],
              },
            ].map((role, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
              >
                <div className="text-blue-600 mb-4">{role.icon}</div>
                <h3 className="text-2xl font-semibold mb-3">{role.title}</h3>
                <p className="text-gray-600 mb-6">{role.description}</p>
                <ul className="mt-auto space-y-2">
                  {role.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">40%</div>
              <div className="text-blue-100">Faster Case Resolution</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Arbitration Institutes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Cases Managed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime Guaranteed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Streamlined Arbitration Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform guides cases through each stage of the arbitration
              lifecycle with precision and efficiency.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 z-0"></div>

            <div className="relative z-10">
              {[
                {
                  title: "Filing",
                  description:
                    "Case submission with automated document organization and initial review",
                },
                {
                  title: "Arbitrator Selection",
                  description:
                    "Streamlined appointment process with conflict checks and availability matching",
                },
                {
                  title: "Procedural Hearings",
                  description:
                    "Integrated scheduling with video conferencing and document sharing",
                },
                {
                  title: "Evidence Submission",
                  description:
                    "Secure document repository with version control and access permissions",
                },
                {
                  title: "Main Hearings",
                  description:
                    "Comprehensive hearing management with transcription and recording options",
                },
                {
                  title: "Award Issuance",
                  description:
                    "Collaborative drafting tools with secure distribution mechanisms",
                },
                {
                  title: "Enforcement",
                  description:
                    "Post-award tracking and documentation for enforcement proceedings",
                },
              ].map((stage, index) => (
                <div
                  key={index}
                  className={`flex items-center mb-12 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div
                    className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"}`}
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      {stage.title}
                    </h3>
                    <p className="text-gray-600">{stage.description}</p>
                  </div>
                  <div className="z-20 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 shadow-lg">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Transform Your Arbitration Process
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join leading arbitration institutes worldwide who trust our platform
            to streamline their case management.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started Now
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
