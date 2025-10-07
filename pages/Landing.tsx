
import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Database, FileCheck, ChevronRight } from '../components/icons';

const features = [
  {
    name: 'AI-Powered Fault Analysis',
    description: 'Our ML engine analyzes symptoms, DTCs, and vehicle data to predict faults with high accuracy, reducing diagnostic time by up to 60%.',
    icon: Cpu,
  },
  {
    name: 'Interactive Diagnostic Manuals',
    description: 'Access step-by-step, context-aware repair procedures with interactive wiring diagrams and visual aids tailored to the predicted fault.',
    icon: FileCheck,
  },
  {
    name: 'Comprehensive DTC Database',
    description: 'Instantly search a vast library of Diagnostic Trouble Codes with detailed descriptions, common causes, and proven repair solutions.',
    icon: Database,
  },
];

const Landing: React.FC = () => {
  return (
    <div className="bg-dark-bg">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden pt-14">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>
        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-dark-text-primary sm:text-6xl font-sans">
                Intelligent Automotive Diagnostics, Simplified
              </h1>
              <p className="mt-6 text-lg leading-8 text-dark-text-secondary font-body">
                Leverage the power of AI to predict electrical faults, streamline complex repairs, and boost your workshop's efficiency and accuracy.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to="/register"
                  className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors"
                >
                  Get started for free
                </Link>
                <Link to="/login" className="text-sm font-semibold leading-6 text-dark-text-primary group">
                  Log in <span aria-hidden="true" className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-dark-surface py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-400">Diagnose Faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-dark-text-primary sm:text-4xl font-sans">
              Everything you need to fix it right the first time
            </p>
            <p className="mt-6 text-lg leading-8 text-dark-text-secondary font-body">
              IAWFPIDM combines cutting-edge AI with a comprehensive knowledge base to eliminate guesswork and empower technicians.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-dark-text-primary">
                    <feature.icon className="h-5 w-5 flex-none text-primary-400" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-dark-text-secondary">
                    <p className="flex-auto font-body">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-dark-bg py-24 sm:py-32">
         <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="relative isolate overflow-hidden bg-dark-surface px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
                 <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl font-sans">
                    Ready to revolutionize your workshop?
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-dark-text-secondary font-body">
                    Sign up today and experience the future of automotive diagnostics. Increase your first-time fix rate and save valuable time.
                </p>
                 <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link to="/register" className="rounded-md bg-accent-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 transition-colors">
                        Create your account
                    </Link>
                 </div>
                 <div className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
                    <div className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25" style={{ clipPath: 'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)' }}></div>
                 </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Landing;
