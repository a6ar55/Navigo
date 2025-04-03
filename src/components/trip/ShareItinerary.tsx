
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Printer, Share2, Download, Copy, Mail, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ShareItinerary: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  
  const handleShareLink = () => {
    const shareUrl = window.location.href;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      toast({
        title: "Link copied to clipboard",
        description: "You can now share this with your travel companions.",
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Failed to copy link",
        description: "Please try again or copy the URL manually.",
        variant: "destructive",
      });
    });
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleEmailShare = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send the itinerary via email
    toast({
      title: "Itinerary shared",
      description: `Your itinerary has been sent to ${email}`,
    });
    
    setEmail('');
  };
  
  const handleDownload = () => {
    // In a real app, this would generate a PDF for download
    toast({
      title: "Downloading itinerary",
      description: "Your itinerary is being prepared for download.",
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-travel-dark">Share Your Itinerary</CardTitle>
        <CardDescription>Share your travel plans with your companions or save for later.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link" className="flex items-center space-x-2">
              <Share2 className="h-4 w-4" />
              <span>Share Link</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="download" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Share Link Tab */}
          <TabsContent value="link" className="space-y-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <div className="text-sm text-gray-600 mb-2">
                Share this link with your travel companions:
              </div>
              <div className="flex space-x-2">
                <Input
                  value={window.location.href}
                  readOnly
                  className="bg-white"
                />
                <Button onClick={handleShareLink} variant="outline" className="flex-shrink-0">
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Email Tab */}
          <TabsContent value="email" className="space-y-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <div className="text-sm text-gray-600 mb-2">
                Send this itinerary to an email address:
              </div>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white"
                />
                <Button onClick={handleEmailShare} className="flex-shrink-0 bg-travel-primary hover:bg-travel-primary/90">
                  Send
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Download Tab */}
          <TabsContent value="download" className="space-y-4">
            <div className="border rounded-md p-4 bg-gray-50">
              <div className="text-sm text-gray-600 mb-2">
                Save your itinerary for offline access:
              </div>
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={handlePrint} 
                  variant="outline" 
                  className="flex items-center justify-center space-x-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Itinerary</span>
                </Button>
                <Button 
                  onClick={handleDownload} 
                  className="flex items-center justify-center space-x-2 bg-travel-primary hover:bg-travel-primary/90"
                >
                  <Download className="h-4 w-4" />
                  <span>Download as PDF</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ShareItinerary;
