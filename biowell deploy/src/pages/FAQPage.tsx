import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'privacy' | 'features';
}

const faqs: FAQ[] = [
  {
    question: "What is Biowell?",
    answer: "Biowell is a personalized wellness platform that uses data from wearables, health apps, and your inputs to give you tailored wellness insights and recommendations.",
    category: 'general',
  },
  {
    question: "How does Biowell work?",
    answer: "Biowell consolidates your wellness data into a simple, easy-to-read dashboard. It analyzes this data and provides actionable recommendations to help you achieve your unique goals.",
    category: 'general',
  },
  {
    question: "Do I need a wearable to use Biowell?",
    answer: "No, you can use Biowell without a wearable. It works with data from your apps and manual inputs, but wearables like Apple Watch or Fitbit will enhance your experience.",
    category: 'technical',
  },
  {
    question: "How does Biowell protect my data?",
    answer: "Your data is securely stored and encrypted. Biowell uses it solely for personalizing your wellness recommendations and does not share it with third parties without your consent.",
    category: 'privacy',
  },
  {
    question: "What happens if I don't have all the data?",
    answer: "That's fine! Biowell works with whatever data you have. As you track more data, the recommendations become more personalized and accurate over time.",
    category: 'technical',
  },
  {
    question: "How often should I check my Biowell recommendations?",
    answer: "You can check your insights daily or weekly. The dashboard gives you real-time updates on your progress and adjusts recommendations as your data changes.",
    category: 'features',
  },
  {
    question: "Can Biowell help with specific health goals?",
    answer: "Yes! Whether it's fitness, weight management, better sleep, or stress reduction, Biowell personalizes your plan with relevant metrics that align with your goals.",
    category: 'features',
  },
  {
    question: "How do I get started with Biowell?",
    answer: "Simply sign up, provide your health data and goals, and Biowell will generate a personalized wellness plan for you.",
    category: 'general',
  },
  {
    question: "Can I track my nutrition with Biowell?",
    answer: "Biowell integrates with apps like MyFitnessPal to track your nutrition, giving you a complete view of your wellness.",
    category: 'features',
  },
  {
    question: "Does Biowell provide workout plans?",
    answer: "While Biowell doesn't provide specific workout plans, it gives you personalized workout insights based on your goals, fitness level, and activity data.",
    category: 'features',
  },
  {
    question: "Can I adjust my wellness plan?",
    answer: "Yes, you can update your wellness goals and preferences at any time. Biowell's recommendations evolve as your goals and data change.",
    category: 'features',
  },
  {
    question: "How is Biowell different from other wellness apps?",
    answer: "Unlike other apps, Biowell combines data from multiple sources and uses AI-driven, science-backed insights to provide a truly personalized wellness experience.",
    category: 'general',
  },
  {
    question: "Is Biowell suitable for beginners?",
    answer: "Absolutely! Biowell adapts to your level, whether you're a beginner or an experienced fitness enthusiast, guiding you toward your wellness goals at a comfortable pace.",
    category: 'general',
  },
  {
    question: "How does Biowell help with mental wellness?",
    answer: "Biowell tracks stress, sleep, and recovery metrics, providing tailored advice to improve mental clarity, reduce stress, and optimize your overall well-being.",
    category: 'features',
  },
  {
    question: "What kind of devices does Biowell integrate with?",
    answer: "Biowell integrates with wearables like Apple Watch, Oura Ring, Fitbit, and health apps such as MyFitnessPal and Google Fit, creating a comprehensive wellness picture.",
    category: 'technical',
  },
  {
    question: "How accurate are Biowell's insights?",
    answer: "Biowell's insights are based on real-time data from reliable sources and peer-reviewed research, ensuring recommendations are science-backed and highly accurate.",
    category: 'technical',
  },
  {
    question: "Can I export my Biowell data?",
    answer: "Yes, Biowell allows you to export your data for personal use or to analyze trends over time.",
    category: 'technical',
  },
  {
    question: "Can Biowell help with chronic conditions?",
    answer: "Yes, Biowell can integrate with apps tracking key health metrics, providing personalized recommendations to manage chronic conditions and improve overall wellness.",
    category: 'features',
  },
  {
    question: "How does Biowell handle my privacy?",
    answer: "Biowell takes privacy seriously. All personal data is encrypted, stored securely, and only used for providing personalized wellness insights. We never share your data without permission.",
    category: 'privacy',
  },
  {
    question: "What happens if I cancel my subscription?",
    answer: "You can cancel at any time, and you'll still have access to your account until the end of your billing period.",
    category: 'general',
  },
];

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'general', name: 'General' },
    { id: 'features', name: 'Features' },
    { id: 'technical', name: 'Technical' },
    { id: 'privacy', name: 'Privacy' },
  ];

  const toggleQuestion = (question: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(question)) {
      newExpanded.delete(question);
    } else {
      newExpanded.add(question);
    }
    setExpandedQuestions(newExpanded);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !activeCategory || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background-alt py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">Frequently Asked Questions</h1>
            <p className="text-text-light">
              Find answers to common questions about Biowell and how it can help optimize your wellness journey.
            </p>
          </motion.div>

          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-light" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] pl-12 pr-4 py-3 text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  !activeCategory
                    ? 'bg-primary text-white'
                    : 'bg-[hsl(var(--color-card))] text-text-light hover:bg-[hsl(var(--color-card-hover))]'
                }`}
              >
                All Questions
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-[hsl(var(--color-card))] text-text-light hover:bg-[hsl(var(--color-card-hover))]'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="overflow-hidden rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))]"
              >
                <button
                  onClick={() => toggleQuestion(faq.question)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="flex-1 font-medium">{faq.question}</span>
                  {expandedQuestions.has(faq.question) ? (
                    <ChevronUp className="h-5 w-5 text-text-light" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-text-light" />
                  )}
                </button>
                
                {expandedQuestions.has(faq.question) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] p-6"
                  >
                    <p className="text-text-light">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-8 text-center">
                <p className="text-text-light">No questions found matching your search.</p>
              </div>
            )}
          </div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 rounded-xl bg-primary p-8 text-center text-white"
          >
            <h2 className="mb-2 text-xl font-bold">Still have questions?</h2>
            <p className="mb-4">Our support team is here to help you 24/7.</p>
            <button className="rounded-xl bg-white px-6 py-3 font-medium text-primary transition-colors hover:bg-white/90">
              Contact Support
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;