import { Bot, Sparkles, Mic, Video, Brain, BarChart3, Zap, Shield, Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";

import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Questions",
      description: "Generate personalized interview questions based on your job position, experience level, and tech stack using advanced AI technology.",
    },
    {
      icon: Mic,
      title: "Voice Recording",
      description: "Record your answers using your microphone. Our speech-to-text technology captures every word accurately for AI analysis.",
    },
    {
      icon: Video,
      title: "Webcam Support",
      description: "Practice with webcam enabled to simulate a real interview environment. Your video is never recorded - privacy guaranteed.",
    },
    {
      icon: BarChart3,
      title: "Instant Feedback",
      description: "Receive detailed AI-powered feedback with ratings and suggestions to improve your interview performance immediately.",
    },
    {
      icon: Target,
      title: "Customized Interviews",
      description: "Create mock interviews tailored to specific job roles, descriptions, and technical requirements.",
    },
    {
      icon: Zap,
      title: "Real-time Analysis",
      description: "Get instant analysis of your answers with comprehensive feedback on technical knowledge and communication skills.",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Build Confidence",
      description: "Practice in a safe, stress-free environment before your real interviews.",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Prepare efficiently with AI-generated questions relevant to your target role.",
    },
    {
      icon: Brain,
      title: "Improve Skills",
      description: "Learn from detailed feedback and continuously enhance your interview techniques.",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Your Interview",
      description: "Fill in your job position, description, years of experience, and tech stack to generate personalized questions.",
    },
    {
      step: "2",
      title: "Answer Questions",
      description: "Record your answers using voice or enable webcam for a more realistic interview experience.",
    },
    {
      step: "3",
      title: "Get AI Feedback",
      description: "Receive instant, detailed feedback with ratings and suggestions to improve your performance.",
    },
    {
      step: "4",
      title: "Review & Improve",
      description: "Review your feedback, practice again, and track your progress over time.",
    },
  ];

  return (
    <div className="flex-col w-full pb-24">
      <Container>
        {/* Header Section */}
        <div className="my-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            About <span className="text-primary">AI Mock Interview</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-3xl mx-auto text-lg">
            AI Mock Interview is an innovative platform that uses artificial intelligence to help you prepare for technical interviews. 
            Practice with AI-generated questions, record your answers, and receive instant feedback to boost your confidence and improve your interview skills.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center mt-6">
            <Button
              asChild
              className="flex items-center gap-2 bg-primary text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:bg-primary/90"
            >
              <Link to="/generate">
                <Sparkles className="w-5 h-5" /> Start Your Mock Interview
              </Link>
            </Button>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It <span className="text-primary">Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Key <span className="text-primary">Features</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose <span className="text-primary">AI Mock Interview</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md"
              >
                <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <div className="mt-16 bg-gray-50 p-8 rounded-lg shadow-md">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Powered by <span className="text-primary">Advanced AI</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-muted-foreground text-center text-lg mb-6">
              Our platform leverages cutting-edge AI technology to generate relevant interview questions 
              and provide comprehensive feedback. Using advanced natural language processing and machine learning, 
              we analyze your responses and offer actionable insights to help you excel in your interviews.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="font-semibold text-primary">Speech Recognition</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="font-semibold text-primary">Natural Language Processing</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="font-semibold text-primary">Machine Learning</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="font-semibold text-primary">Real-time Analysis</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/10 to-primary/5 p-12 rounded-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have improved their interview skills with AI Mock Interview. 
            Start practicing today and get one step closer to your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="flex items-center gap-2 bg-primary text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:bg-primary/90"
            >
              <Link to="/generate">
                <Sparkles className="w-5 h-5" /> Create Mock Interview
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex items-center gap-2 px-8 py-6 text-lg rounded-xl"
            >
              <a
                href="https://www.messenger.com/t/754307874422696"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Bot className="w-5 h-5" /> Get AI Support
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AboutPage;
