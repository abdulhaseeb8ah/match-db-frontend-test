import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiClient } from "@/lib/api";
import { Building, MapPin, Clock, Users, DollarSign, Bookmark, ExternalLink, Star, Zap, Award, TrendingUp, Globe, Database } from "lucide-react";

interface JobCardProps {
  job: any;
  showApplyButton?: boolean;
}

export default function JobCard({ job, showApplyButton = true }: JobCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const applyMutation = useMutation({
    mutationFn: async (data: { jobId: string; coverLetter?: string }) => {
      return apiClient.applications.create(data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your application has been sent successfully!",
      });
      setIsApplyDialogOpen(false);
      setCoverLetter("");
      queryClient.invalidateQueries({ queryKey: ["/api/applications/me"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleApply = () => {
    if (!user?.profile) {
      toast({
        title: "Profile Required",
        description: "Please complete your profile before applying to jobs.",
        variant: "destructive",
      });
      return;
    }
    
    applyMutation.mutate({
      jobId: job.id,
      coverLetter: coverLetter.trim() || undefined,
    });
  };

  const formatSalary = (min?: number, max?: number, type?: string) => {
    if (!min && !max) return null;
    
    const formatNumber = (num: number) => {
      if (type === 'hourly') return `$${num}/hr`;
      if (type === 'daily') return `$${num}/day`;
      return `$${(num / 1000).toFixed(0)}k`;
    };

    if (min && max) {
      return `${formatNumber(min)} - ${formatNumber(max)}`;
    }
    return min ? `${formatNumber(min)}+` : `Up to ${formatNumber(max!)}`;
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const jobDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-background to-muted/30">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Database className="h-8 w-8 text-[#FF6B35]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#FF6B35] transition-colors duration-300" data-testid={`job-title-${job.id}`}>
                {job.title}
              </h3>
              <div className="flex items-center space-x-3 text-gray-600 text-sm">
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  <span data-testid={`job-company-${job.id}`}>DataBricks Company</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span data-testid={`job-location-${job.id}`}>{job.location}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  {job.type}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right space-y-2">
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryType) && (
              <div className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent" data-testid={`job-salary-${job.id}`}>
                {formatSalary(job.salaryMin, job.salaryMax, job.salaryType)}
              </div>
            )}
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              {timeAgo(job.createdAt)}
            </div>
            <div className="flex items-center text-sm text-[#FF6B35]">
              <Star className="h-4 w-4 mr-1 fill-current" />
              <span>Featured</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3" data-testid={`job-description-${job.id}`}>
          {job.description}
        </p>
        
        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.slice(0, 4).map((skill: string) => (
              <Badge key={skill} variant="secondary" data-testid={`job-skill-${job.id}-${skill}`}>
                {skill}
              </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge variant="outline">+{job.skills.length - 4} more</Badge>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span data-testid={`job-applicants-${job.id}`}>
                {job.applicationCount || 0} applicant{job.applicationCount !== 1 ? 's' : ''}
              </span>
            </div>
            {job.experienceLevel && (
              <Badge variant="outline" data-testid={`job-experience-${job.id}`}>
                {job.experienceLevel} level
              </Badge>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" data-testid={`button-save-job-${job.id}`}>
              <Bookmark className="h-4 w-4 mr-1" />
              Save
            </Button>
            
            {showApplyButton && (
              <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" data-testid={`button-apply-job-${job.id}`}>
                    Apply Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Apply to {job.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-gray-100/50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Building className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-gray-600">
                            Company • {job.location} • {job.type}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Cover Letter (Optional)
                      </label>
                      <Textarea
                        placeholder="Tell the employer why you're interested in this position and how your DataBricks experience makes you a great fit..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="min-h-[120px]"
                        data-testid="textarea-cover-letter"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsApplyDialogOpen(false)}
                        data-testid="button-cancel-apply"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleApply}
                        disabled={applyMutation.isPending}
                        data-testid="button-submit-apply"
                      >
                        {applyMutation.isPending ? "Applying..." : "Submit Application"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
