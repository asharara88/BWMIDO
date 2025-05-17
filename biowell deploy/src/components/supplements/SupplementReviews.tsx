import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, User } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  unhelpful: number;
  verified: boolean;
}

interface SupplementReviewsProps {
  supplementId: string;
}

const SupplementReviews = ({ supplementId }: SupplementReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    // In a real app, fetch reviews from API
    // For demo, generate random reviews
    setLoading(true);
    setTimeout(() => {
      const demoReviews = generateDemoReviews(supplementId);
      setReviews(demoReviews);
      setLoading(false);
    }, 500);
  }, [supplementId]);

  const generateDemoReviews = (id: string): Review[] => {
    const reviewCount = Math.floor(Math.random() * 5) + 3; // 3-8 reviews for mobile
    const reviews: Review[] = [];
    
    const titles = [
      "Great product, recommend",
      "Works as advertised",
      "Noticed a difference",
      "Good quality supplement",
      "Will buy again",
      "Helped with my sleep",
      "Improved my energy",
      "Not sure if it works yet",
      "Better than others I've tried",
      "Good value"
    ];
    
    const contents = [
      "I've been taking this supplement for about a month now and have noticed improvements in my overall health. The quality seems excellent and I haven't experienced any side effects.",
      "This product has become an essential part of my daily routine. I feel more energetic and focused throughout the day. Will definitely continue using it.",
      "I was skeptical at first, but after consistent use I can definitely feel the difference. My sleep quality has improved and I wake up feeling more refreshed.",
      "The price is reasonable for the quality you get. I've tried cheaper alternatives but they didn't work as well. This one delivers on its promises.",
      "I appreciate that this supplement doesn't have any artificial fillers or additives. It's clean, effective, and easy to incorporate into my daily routine.",
      "I've been using this for my specific health condition and have seen gradual improvement. It's not a miracle cure, but it definitely helps manage my symptoms.",
      "The capsules are easy to swallow and don't have any aftertaste. I've had issues with other supplements in the past, but this one is perfect.",
      "I'm giving this 4 stars because while it works well, I think the price could be a bit lower. Otherwise, it's a solid product that does what it claims.",
      "This supplement was recommended by my nutritionist and I can see why. The quality is evident and the results speak for themselves.",
      "I've tried many supplements over the years and this is one of the few that I can actually feel working. Will be a repeat customer for sure."
    ];
    
    const names = [
      "John D.", "Sarah M.", "Michael T.", "Emma R.", "David K.",
      "Lisa P.", "Robert J.", "Jennifer L.", "William S.", "Olivia G."
    ];
    
    for (let i = 0; i < reviewCount; i++) {
      const rating = Math.floor(Math.random() * 2) + 3; // 3-5 stars
      const titleIndex = Math.floor(Math.random() * titles.length);
      const contentIndex = Math.floor(Math.random() * contents.length);
      const nameIndex = Math.floor(Math.random() * names.length);
      
      // Generate a random date within the last 6 months
      const date = new Date();
      date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
      
      reviews.push({
        id: `review-${id}-${i}`,
        author: names[nameIndex],
        rating,
        title: titles[titleIndex],
        content: contents[contentIndex],
        date: date.toLocaleDateString(),
        helpful: Math.floor(Math.random() * 20),
        unhelpful: Math.floor(Math.random() * 5),
        verified: Math.random() > 0.3 // 70% chance of being verified
      });
    }
    
    return reviews;
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, send to API
    const newReviewObj: Review = {
      id: `review-${supplementId}-${Date.now()}`,
      author: 'You',
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      date: new Date().toLocaleDateString(),
      helpful: 0,
      unhelpful: 0,
      verified: true
    };
    
    setReviews([newReviewObj, ...reviews]);
    setNewReview({ rating: 5, title: '', content: '' });
    setShowReviewForm(false);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-warning text-warning' : 'text-text-light'}`} 
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Customer Reviews</h3>
            <div className="flex items-center gap-2">
              <div className="flex">
                {renderStars(4.5)}
              </div>
              <span className="text-sm text-text-light">Based on {reviews.length} reviews</span>
            </div>
          </div>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleReviewSubmit} className="rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] p-4">
          <h3 className="mb-4 text-lg font-medium">Write a Review</h3>
          
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="p-1"
                >
                  <Star className={`h-6 w-6 ${star <= newReview.rating ? 'fill-warning text-warning' : 'text-text-light'}`} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="reviewTitle" className="mb-1 block text-sm font-medium">Title</label>
            <input
              id="reviewTitle"
              type="text"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              className="w-full rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] px-3 py-2"
              placeholder="Summarize your experience"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="reviewContent" className="mb-1 block text-sm font-medium">Review</label>
            <textarea
              id="reviewContent"
              value={newReview.content}
              onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
              className="h-24 w-full rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] px-3 py-2"
              placeholder="Share your experience with this product"
              required
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--color-card))] text-text-light">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.author}</span>
                    {review.verified && (
                      <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-text-light">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span>{review.date}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <h4 className="mb-1 font-medium">{review.title}</h4>
            <p className="mb-3 text-sm text-text-light">{review.content}</p>
            
            <div className="flex items-center gap-4 text-xs">
              <span>Was this helpful?</span>
              <button className="flex items-center gap-1 text-text-light hover:text-text">
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{review.helpful}</span>
              </button>
              <button className="flex items-center gap-1 text-text-light hover:text-text">
                <ThumbsDown className="h-3.5 w-3.5" />
                <span>{review.unhelpful}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplementReviews;