import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Watch, Smartphone, Activity, Heart, Scale, Droplet, AlertCircle, CheckCircle, Plus, LineChart, Brain, Zap, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getDeviceImage } from '../../utils/deviceImages';
import ImageWithFallback from '../../components/common/ImageWithFallback';

interface DeviceType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  connected: boolean;
  popular?: boolean;
  category?: string;
  benefits?: string[];
  setupTime?: string;
  imageUrl?: string;
}

const DevicesPage = () => {
  const { isDemo } = useAuth();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [devices, setDevices] = useState<DeviceType[]>([
    {
      id: 'freestyle-libre',
      name: 'FreeStyle Libre',
      icon: <LineChart className="h-6 w-6" />,
      description: 'Continuous glucose monitoring system with up to 14 days of wear.',
      connected: false,
      popular: true,
      category: 'cgm',
      benefits: ['Real-time glucose data', 'No finger pricks', 'Trend analysis'],
      setupTime: '5 min',
      imageUrl: getDeviceImage('freestyle-libre')
    },
    {
      id: 'dexcom-g7',
      name: 'Dexcom G7',
      icon: <LineChart className="h-6 w-6" />,
      description: 'Advanced CGM system with real-time glucose readings and alerts.',
      connected: false,
      popular: true,
      category: 'cgm',
      benefits: ['10-day wear', 'Mobile alerts', 'Share data'],
      setupTime: '5 min',
      imageUrl: getDeviceImage('dexcom-g7')
    },
    {
      id: 'apple-watch',
      name: 'Apple Watch',
      icon: <Watch className="h-6 w-6" />,
      description: 'Sync activity, heart rate, sleep, and more from your Apple Watch.',
      connected: isDemo,
      popular: true,
      category: 'wearable',
      benefits: ['Activity tracking', 'Heart rate', 'Sleep analysis'],
      setupTime: '2 min',
      imageUrl: getDeviceImage('apple-watch')
    },
    {
      id: 'oura-ring',
      name: 'Oura Ring',
      icon: <Brain className="h-6 w-6" />,
      description: 'Connect your Oura Ring to track sleep, readiness, and activity scores.',
      connected: false,
      popular: true,
      category: 'wearable',
      benefits: ['Sleep tracking', 'Recovery metrics', 'Temperature'],
      setupTime: '3 min',
      imageUrl: 'https://leznzqfezoofngumpiqf.supabase.co/storage/v1/object/sign/people/v.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5X2UyYTcyNGEyLTZkNTctNDk4YS04ZGU1LWY2Y2Q4MjAyNjA3YiJ9.eyJ1cmwiOiJwZW9wbGUvdi5wbmciLCJpYXQiOjE3NDYzMzAxNjIsImV4cCI6MTc3Nzg2NjE2Mn0.SuTmeSvb2uIy0ObwEOgQ8BnslWvEyjWQ243u7pfOj7c'
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      icon: <Heart className="h-6 w-6" />,
      description: 'Sync your Fitbit data including steps, sleep, and heart rate.',
      connected: false,
      popular: true,
      category: 'wearable',
      benefits: ['Step counting', 'Sleep stages', 'Exercise tracking'],
      setupTime: '2 min',
      imageUrl: getDeviceImage('fitbit')
    },
    {
      id: 'garmin',
      name: 'Garmin',
      icon: <Activity className="h-6 w-6" />,
      description: 'Connect your Garmin device to track workouts, heart rate, and more.',
      connected: false,
      category: 'wearable',
      benefits: ['GPS tracking', 'Training load', 'Recovery time'],
      setupTime: '3 min',
      imageUrl: getDeviceImage('garmin')
    },
    {
      id: 'whoop',
      name: 'Whoop',
      icon: <Zap className="h-6 w-6" />,
      description: 'Sync recovery, strain, and sleep data from your Whoop strap.',
      connected: false,
      category: 'wearable',
      benefits: ['Strain tracking', 'Recovery score', 'Sleep coach'],
      setupTime: '2 min',
      imageUrl: getDeviceImage('whoop')
    },
    {
      id: 'apple-health',
      name: 'Apple Health',
      icon: <Smartphone className="h-6 w-6" />,
      description: 'Connect to Apple Health to sync data from multiple sources.',
      connected: false,
      popular: true,
      category: 'health-app',
      benefits: ['Data aggregation', 'Health records', 'Workout data'],
      setupTime: '1 min',
      imageUrl: getDeviceImage('apple-health')
    },
    {
      id: 'google-fit',
      name: 'Google Fit',
      icon: <Smartphone className="h-6 w-6" />,
      description: 'Connect to Google Fit to sync data from Android devices and apps.',
      connected: false,
      category: 'health-app',
      benefits: ['Activity minutes', 'Heart points', 'Step tracking'],
      setupTime: '1 min',
      imageUrl: getDeviceImage('google-fit')
    },
    {
      id: 'withings',
      name: 'Withings',
      icon: <Scale className="h-6 w-6" />,
      description: 'Connect your Withings smart scale and blood pressure monitor.',
      connected: false,
      category: 'health-device',
      benefits: ['Weight tracking', 'Body composition', 'Blood pressure'],
      setupTime: '2 min',
      imageUrl: getDeviceImage('withings')
    },
  ]);

  const categories = [
    { id: null, name: 'All Devices', icon: <Activity className="h-4 w-4" /> },
    { id: 'cgm', name: 'CGM Devices', icon: <LineChart className="h-4 w-4" /> },
    { id: 'wearable', name: 'Wearables', icon: <Watch className="h-4 w-4" /> },
    { id: 'health-app', name: 'Health Apps', icon: <Smartphone className="h-4 w-4" /> },
    { id: 'health-device', name: 'Health Devices', icon: <Scale className="h-4 w-4" /> },
  ];

  const filteredDevices = selectedCategory
    ? devices.filter(device => device.category === selectedCategory)
    : devices;

  const handleConnect = async (deviceId: string) => {
    if (isDemo) {
      setConnecting(deviceId);
      setSuccessMessage(null);
      setErrorMessage(null);
      
      setTimeout(() => {
        setConnecting(null);
        setDevices(devices.map(device => 
          device.id === deviceId ? { ...device, connected: true } : device
        ));
        setSuccessMessage(`Successfully connected to ${devices.find(d => d.id === deviceId)?.name}`);
      }, 1500);
      return;
    }

    setConnecting(deviceId);
    setSuccessMessage(null);
    setErrorMessage(null);
    
    setTimeout(() => {
      if (Math.random() > 0.1) {
        setDevices(devices.map(device => 
          device.id === deviceId ? { ...device, connected: true } : device
        ));
        setSuccessMessage(`Successfully connected to ${devices.find(d => d.id === deviceId)?.name}`);
      } else {
        setErrorMessage(`Failed to connect to ${devices.find(d => d.id === deviceId)?.name}. Please try again.`);
      }
      setConnecting(null);
    }, 1500);
  };

  const handleDisconnect = async (deviceId: string) => {
    if (isDemo) {
      setConnecting(deviceId);
      setSuccessMessage(null);
      setErrorMessage(null);
      
      setTimeout(() => {
        setConnecting(null);
        setDevices(devices.map(device => 
          device.id === deviceId ? { ...device, connected: false } : device
        ));
        setSuccessMessage(`Successfully disconnected from ${devices.find(d => d.id === deviceId)?.name}`);
      }, 1000);
      return;
    }

    setConnecting(deviceId);
    setSuccessMessage(null);
    setErrorMessage(null);
    
    setTimeout(() => {
      setDevices(devices.map(device => 
        device.id === deviceId ? { ...device, connected: false } : device
      ));
      setSuccessMessage(`Successfully disconnected from ${devices.find(d => d.id === deviceId)?.name}`);
      setConnecting(null);
    }, 1000);
  };

  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">Connect Your Devices</h1>
          <p className="mt-2 text-text-light">
            Sync your health data automatically from your favorite devices and apps
          </p>
        </div>

        {isDemo && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-primary/10 p-4 text-primary">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>
              You're in demo mode. Connect your devices to get personalized insights based on your own data.
            </p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-success/10 p-4 text-success">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <p>{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-error/10 p-4 text-error">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-4">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold">{devices.filter(d => d.connected).length}</div>
            <div className="text-sm text-text-light">Connected Devices</div>
          </div>
          
          <div className="rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-4">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <Watch className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold">{devices.filter(d => d.category === 'wearable').length}</div>
            <div className="text-sm text-text-light">Available Wearables</div>
          </div>
          
          <div className="rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-4">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold">{devices.filter(d => d.category === 'health-app').length}</div>
            <div className="text-sm text-text-light">Health Apps</div>
          </div>
          
          <div className="rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-4">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-sm text-text-light">Continuous Sync</div>
          </div>
        </div>

        {/* Category filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-[hsl(var(--color-card))] text-text-light hover:bg-[hsl(var(--color-card-hover))]'
              }`}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>

        {/* Devices Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDevices.map((device) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group flex flex-col rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-4 transition-shadow hover:shadow-md sm:p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    {device.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{device.name}</h3>
                      {device.popular && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-light">{device.description}</p>
                  </div>
                </div>
              </div>

              {/* Device Image - Full height, no cropping */}
              {device.imageUrl && (
                <div className="mb-4 h-48 w-full overflow-hidden rounded-lg">
                  <ImageWithFallback 
                    src={device.imageUrl} 
                    alt={device.name} 
                    className="h-full w-full"
                    objectFit="contain"
                  />
                </div>
              )}

              {/* Benefits */}
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2 text-sm text-text-light">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Key Benefits
                </div>
                <div className="flex flex-wrap gap-2">
                  {device.benefits?.map((benefit) => (
                    <span
                      key={benefit}
                      className="rounded-full bg-[hsl(var(--color-background))] px-2 py-1 text-xs"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Setup Time */}
              <div className="mb-4 flex items-center gap-2 text-sm text-text-light">
                <Clock className="h-4 w-4" />
                Setup time: {device.setupTime}
              </div>

              {device.connected ? (
                <button
                  onClick={() => handleDisconnect(device.id)}
                  disabled={connecting === device.id}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-error/50 bg-error/10 px-4 py-2 text-sm font-medium text-error transition-colors hover:bg-error/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {connecting === device.id ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-error border-t-transparent"></div>
                      Disconnecting...
                    </>
                  ) : (
                    'Disconnect'
                  )}
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(device.id)}
                  disabled={connecting === device.id}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {connecting === device.id ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Connect
                    </>
                  )}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DevicesPage;