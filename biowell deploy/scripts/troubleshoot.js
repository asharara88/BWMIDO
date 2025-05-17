import { execSync } from 'child_process';
import { createServer } from 'vite';

async function checkPort(port) {
  try {
    const server = await createServer({
      server: { port }
    });
    await server.listen();
    await server.close();
    return true;
  } catch (err) {
    return false;
  }
}

async function diagnoseServer() {
  // Check port availability
  const port = 5173; // Vite's default port
  const isPortAvailable = await checkPort(port);
  
  console.log(`\n=== Development Server Diagnostics ===`);
  console.log(`Port ${port} status: ${isPortAvailable ? 'Available' : 'In use'}`);
  
  // Check Node version
  const nodeVersion = process.version;
  console.log(`Node version: ${nodeVersion}`);
  
  // Check running processes
  try {
    const processes = execSync('ps aux | grep node').toString();
    console.log('\nRunning Node processes:');
    console.log(processes);
  } catch (err) {
    console.log('Could not check running processes');
  }
  
  // Check network interfaces
  try {
    const interfaces = execSync('ifconfig || ipconfig').toString();
    console.log('\nNetwork interfaces:');
    console.log(interfaces);
  } catch (err) {
    console.log('Could not check network interfaces');
  }
}

diagnoseServer().catch(console.error);