
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-travel-dark">About WanderLust AI</h1>
          
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-gray-700 mb-6">
              WanderLust AI is an innovative travel planning platform that uses artificial intelligence to create personalized travel itineraries tailored to your preferences, budget, and travel style.
            </p>
            
            <p className="text-gray-700 mb-6">
              Our mission is to make travel planning effortless and enjoyable, allowing you to focus on the experiences that matter most. Whether you're planning a weekend getaway or an extended international adventure, our AI-powered platform analyzes thousands of options to create the perfect itinerary for you.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4 text-travel-dark">Our Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Personalized Itineraries</h3>
                  <p className="text-gray-600">
                    Customized daily plans based on your interests, travel style, and preferences.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Budget Management</h3>
                  <p className="text-gray-600">
                    Detailed cost breakdowns and expense tracking to help you stay within budget.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Weather Integration</h3>
                  <p className="text-gray-600">
                    Weather-aware planning that suggests appropriate activities and packing items.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Local Insights</h3>
                  <p className="text-gray-600">
                    Recommendations for hidden gems and authentic experiences beyond typical tourist spots.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4 text-travel-dark">How It Works</h2>
            
            <p className="text-gray-700 mb-4">
              Our platform leverages advanced AI technology to process vast amounts of travel data, including:
            </p>
            
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li className="mb-2">Accommodation options that match your preferences and budget</li>
              <li className="mb-2">Transportation methods with real-time pricing and schedules</li>
              <li className="mb-2">Weather forecasts to suggest appropriate activities</li>
              <li className="mb-2">Local events and seasonal considerations</li>
              <li className="mb-2">Dining recommendations based on dietary preferences</li>
              <li>Cultural insights to enhance your experience</li>
            </ul>
            
            <p className="text-gray-700 mb-10">
              This data is processed and analyzed to create a comprehensive travel plan that maximizes your enjoyment while respecting your constraints.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4 text-travel-dark">Our Team</h2>
            
            <p className="text-gray-700 mb-6">
              WanderLust AI was created by a team of passionate travelers and technology enthusiasts who believe that planning should be part of the joy of travel, not a source of stress.
            </p>
            
            <p className="text-gray-700 mb-10">
              Our diverse team brings together expertise in artificial intelligence, travel industry knowledge, and user experience design to create a platform that truly understands and anticipates travelers' needs.
            </p>
            
            <div className="bg-travel-primary/10 p-6 rounded-lg mt-10">
              <h2 className="text-xl font-semibold mb-3 text-travel-dark">Get in Touch</h2>
              <p className="text-gray-700 mb-2">
                Have questions or suggestions? We'd love to hear from you!
              </p>
              <p className="text-gray-700">
                Contact us at <a href="mailto:hello@wanderlust-ai.com" className="text-travel-primary hover:underline">hello@wanderlust-ai.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
