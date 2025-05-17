import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import ImageManager from '../../components/admin/ImageManager';
import ImageGallery from '../../components/common/ImageGallery';
import { allImageAssets, logoAssets, deviceAssets, supplementAssets, backgroundAssets } from '../../utils/imageManager';
import { FileImage, Image, Activity, Package, Layout } from 'lucide-react';

const ImageManagementPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    { id: 'all', name: 'All Images', icon: <FileImage className="h-4 w-4" />, count: allImageAssets.length },
    { id: 'logo', name: 'Logos', icon: <Image className="h-4 w-4" />, count: logoAssets.length },
    { id: 'device', name: 'Devices', icon: <Activity className="h-4 w-4" />, count: deviceAssets.length },
    { id: 'supplement', name: 'Supplements', icon: <Package className="h-4 w-4" />, count: supplementAssets.length },
    { id: 'background', name: 'Backgrounds', icon: <Layout className="h-4 w-4" />, count: backgroundAssets.length },
  ];

  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">Image Management</h1>
          <p className="text-text-light">
            Manage and validate all image assets used in the application
          </p>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-2 sm:grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2"
              >
                {category.icon}
                <span className="hidden sm:inline">{category.name}</span>
                <span className="ml-1 rounded-full bg-[hsl(var(--color-surface-1))] px-2 py-0.5 text-xs">
                  {category.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all">
            <ImageManager />
          </TabsContent>
          
          <TabsContent value="logo">
            <ImageGallery category="logo" />
          </TabsContent>
          
          <TabsContent value="device">
            <ImageGallery category="device" />
          </TabsContent>
          
          <TabsContent value="supplement">
            <ImageGallery category="supplement" />
          </TabsContent>
          
          <TabsContent value="background">
            <ImageGallery category="background" />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ImageManagementPage;