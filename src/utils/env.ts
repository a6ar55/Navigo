
// Utility function to access environment variables
export const getEnvVariable = (key: string): string => {
  const value = import.meta.env[key];
  
  if (!value) {
    console.warn(`Environment variable ${key} is not set. Please check your .env file.`);
    
    // Show more helpful error in development
    if (import.meta.env.DEV) {
      console.error(`
        ======================================================
        MISSING ENVIRONMENT VARIABLE: ${key}
        
        Please create or update your .env file in the project root
        with the following:
        
        ${key}=your_value_here
        
        Then restart your development server.
        ======================================================
      `);
    }
  }
  
  return value || '';
};
