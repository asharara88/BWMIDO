import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Shield, Watch, Brain, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ConnectCard from '../components/home/ConnectCard';

const HomePage = () => {
  const { user, startDemo } = useAuth();

  const handleDemoClick = () => {
    startDemo();
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background-alt py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm text-primary">
                <Shield className="h-4 w-4" />
                <span>Evidence-based health optimization</span>
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Your Personal{' '}
                <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  Health Coach
                </span>
              </h1>

              <p className="mx-auto mb-8 max-w-2xl text-lg text-text-light sm:text-xl">
                Transform your health with personalized insights and evidence-based recommendations.
              </p>

              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                {user ? (
                  <Link
                    to="/dashboard"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-primary-dark sm:w-auto"
                  >
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-primary-dark sm:w-auto"
                    >
                      Get Started
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <button
                      onClick={handleDemoClick}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] px-8 py-4 text-lg font-semibold transition-all hover:bg-[hsl(var(--color-card-hover))] sm:w-auto"
                    >
                      Try Demo
                      <Activity className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-text-light">
              Our platform analyzes your health data to provide personalized recommendations.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <ConnectCard />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group flex h-full flex-col overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-1 flex-col justify-between bg-[hsl(var(--color-card))] p-6">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary">
                      <Brain className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Analyze</h3>
                  </div>
                  
                  <p className="mb-4 text-text-light">Your data is analyzed for patterns in sleep, activity, and nutrition.</p>

                  <div className="mb-4 space-y-2">
                    {['Pattern recognition', 'Trend analysis', 'Health insights'].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group flex h-full flex-col overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-1 flex-col justify-between bg-[hsl(var(--color-card))] p-6">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Personalize</h3>
                  </div>
                  
                  <p className="mb-4 text-text-light">Get personalized supplement recommendations and health advice.</p>

                  <div className="mb-4 space-y-2">
                    {['Custom recommendations', 'Goal-based planning', 'Progress tracking'].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;