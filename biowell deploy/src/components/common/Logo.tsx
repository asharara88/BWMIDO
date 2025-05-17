import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Activity } from 'lucide-react';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'light' | 'dark';
}

const Logo = ({ className = '', variant = 'default' }: LogoProps) => {
  const { currentTheme } = useTheme();

  // Determine which logo to use based on variant and theme
  const logoUrl = variant === 'light' || (variant === 'default' && currentTheme === 'light')
    ? 'https://jvqweleqjkrgldeflnfr.supabase.co/storage/v1/object/sign/heroes/bwapp.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzFhYTRlZDEyLWU0N2QtNDcyNi05ZmI0LWQ3MWM5MGFlOTYyZSJ9.eyJ1cmwiOiJoZXJvZXMvYndhcHAuc3ZnIiwiaWF0IjoxNzQ2NTgxMjA5LCJleHAiOjE3NzgxMTcyMDl9.cvRy6vAanMApFYs0OgdDeCeqm5p-fz2FVdQvKcxxic0'
    : 'https://jvqweleqjkrgldeflnfr.supabase.co/storage/v1/object/sign/heroes/logobg.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzFhYTRlZDEyLWU0N2QtNDcyNi05ZmI0LWQ3MWM5MGFlOTYyZSJ9.eyJ1cmwiOiJoZXJvZXMvbG9nb2JnLnBuZyIsImlhdCI6MTc0NjU4MTI4MSwiZXhwIjoxNzc4MTE3MjgxfQ.o7Fzr-C2JxQfgnlGg_2LmN9A7BQesg1-_98BnyDzn4Q';

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img 
        src={logoUrl} 
        alt="Biowell Logo" 
        className="h-32 w-auto object-contain" // Increased from h-8 to h-32 (4x larger)
        onError={(e) => {
          // Fallback to text logo if image fails to load
          e.currentTarget.style.display = 'none';
          const parent = e.currentTarget.parentElement;
          if (parent) {
            const fallback = document.createElement('div');
            fallback.className = "flex items-center gap-2 text-primary font-bold text-xl";
            fallback.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg><span>Biowell</span>`;
            parent.appendChild(fallback);
          }
        }}
      />
    </Link>
  );
};

export default Logo;