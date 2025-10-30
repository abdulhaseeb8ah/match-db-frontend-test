import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, DollarSign, Star, Eye, ExternalLink, Briefcase } from "lucide-react";

interface ProfileCardProps {
  profile: any;
  showContactButton?: boolean;
}

export default function ProfileCard({ profile, showContactButton = true }: ProfileCardProps) {
  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    }
    return "U";
  };

  const formatExperience = (years: number) => {
    if (years === 0) return "New";
    if (years === 1) return "1 year";
    return `${years} years`;
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'default';
      case 'busy':
        return 'secondary';
      case 'not_available':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 card-hover">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profile.user?.profileImageUrl} alt="Profile" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-lg">
              {getInitials(profile.user?.firstName, profile.user?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg" data-testid={`profile-name-${profile.id}`}>
              {profile.user?.firstName} {profile.user?.lastName}
            </h3>
            <p className="text-gray-600" data-testid={`profile-title-${profile.id}`}>
              {profile.title}
            </p>
            <div className="flex items-center mt-1 space-x-2">
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                <span>4.9 (23 reviews)</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge 
              variant={getAvailabilityColor(profile.availability)}
              className="flex items-center mb-2"
              data-testid={`profile-availability-${profile.id}`}
            >
              <Clock className="h-3 w-3 mr-1" />
              {profile.availability || 'Unknown'}
            </Badge>
            {profile.hourlyRate && (
              <div className="text-sm font-semibold text-gray-900" data-testid={`profile-rate-${profile.id}`}>
                ${profile.hourlyRate}/hr
              </div>
            )}
          </div>
        </div>
        
        {profile.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2" data-testid={`profile-bio-${profile.id}`}>
            {profile.bio}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.skills?.slice(0, 3).map((skill: string) => (
            <Badge key={skill} variant="secondary" className="text-xs" data-testid={`profile-skill-${profile.id}-${skill}`}>
              {skill}
            </Badge>
          ))}
          {profile.skills?.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{profile.skills.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            {profile.location && (
              <div className="flex items-center" data-testid={`profile-location-${profile.id}`}>
                <MapPin className="h-3 w-3 mr-1" />
                {profile.location}
              </div>
            )}
            {profile.experience !== undefined && (
              <div className="flex items-center" data-testid={`profile-experience-${profile.id}`}>
                <Briefcase className="h-3 w-3 mr-1" />
                {formatExperience(profile.experience)} exp.
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            <span>Profile views this week</span>
          </div>
        </div>

        {/* Certifications */}
        {profile.certifications?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-900 mb-2">Top Certifications:</p>
            <div className="flex flex-wrap gap-1">
              {profile.certifications.slice(0, 2).map((cert: string) => (
                <Badge key={cert} variant="outline" className="text-xs border-[#FF6B35] text-[#FF6B35]">
                  {cert.length > 30 ? `${cert.substring(0, 30)}...` : cert}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {profile.portfolioUrl && (
              <Button variant="outline" size="sm" asChild data-testid={`profile-portfolio-${profile.id}`}>
                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Portfolio
                </a>
              </Button>
            )}
            {profile.linkedinUrl && (
              <Button variant="outline" size="sm" asChild data-testid={`profile-linkedin-${profile.id}`}>
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  LinkedIn
                </a>
              </Button>
            )}
          </div>
          
          {showContactButton && (
            <Button size="sm" data-testid={`button-contact-${profile.id}`}>
              Contact
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
