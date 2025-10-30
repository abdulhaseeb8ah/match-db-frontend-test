import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { X, Plus } from "lucide-react";

// Profile form validation schema
const profileSchema = z.object({
  title: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
  location: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  hourlyRate: z.number().optional(),
  availability: z.string().optional(),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  isPublic: z.boolean().optional(),
});

const formSchema = profileSchema.extend({
  skillInput: z.string().optional(),
  certificationInput: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ProfileFormProps {
  profile?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function ProfileForm({ profile, onSave, onCancel, isPending }: ProfileFormProps) {
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [certifications, setCertifications] = useState<string[]>(profile?.certifications || []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: profile?.title || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      experience: profile?.experience || 0,
      hourlyRate: profile?.hourlyRate || 0,
      availability: profile?.availability || "available",
      portfolioUrl: profile?.portfolioUrl || "",
      linkedinUrl: profile?.linkedinUrl || "",
      githubUrl: profile?.githubUrl || "",
      isPublic: profile?.isPublic ?? true,
      skillInput: "",
      certificationInput: "",
    },
  });

  const addSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      setSkills([...skills, skill.trim()]);
      form.setValue("skillInput", "");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addCertification = (cert: string) => {
    if (cert.trim() && !certifications.includes(cert.trim())) {
      setCertifications([...certifications, cert.trim()]);
      form.setValue("certificationInput", "");
    }
  };

  const removeCertification = (cert: string) => {
    setCertifications(certifications.filter(c => c !== cert));
  };

  const onSubmit = (data: FormData) => {
    const { skillInput, certificationInput, ...profileData } = data;
    onSave({
      ...profileData,
      skills,
      certifications,
    });
  };

  const popularSkills = [
    "Apache Spark", "Delta Lake", "MLflow", "DataBricks SQL", "Python", "Scala", 
    "Unity Catalog", "Data Mesh", "Lakehouse", "Kubernetes", "Terraform", "Azure", "AWS"
  ];

  const popularCertifications = [
    "Databricks Certified Data Engineer Associate",
    "Databricks Certified Data Engineer Professional", 
    "Databricks Certified Data Analyst Associate",
    "Databricks Certified Machine Learning Associate",
    "Databricks Certified Machine Learning Professional",
    "Apache Spark Developer Certification",
    "Azure Data Engineer Associate",
    "AWS Certified Data Analytics"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Senior DataBricks Engineer" 
                      {...field}
                      data-testid="input-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Summary</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your experience, expertise, and what makes you unique..."
                      className="min-h-[120px]"
                      {...field}
                      data-testid="textarea-bio"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. San Francisco, CA or Remote" 
                        {...field}
                        data-testid="input-location"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-experience"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly Rate (USD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="e.g. 150"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-hourly-rate"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-availability">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="busy">Busy</SelectItem>
                        <SelectItem value="not_available">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills & Expertise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <FormLabel>Skills</FormLabel>
              <div className="flex space-x-2 mt-2">
                <FormField
                  control={form.control}
                  name="skillInput"
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        placeholder="Add a skill..."
                        {...field}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill(field.value || "");
                          }
                        }}
                        data-testid="input-skill"
                      />
                    </FormControl>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addSkill(form.getValues("skillInput") || "")}
                  data-testid="button-add-skill"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Popular Skills */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Popular DataBricks Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {popularSkills.map((skill) => (
                    <Button
                      key={skill}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSkill(skill)}
                      className="text-xs"
                      disabled={skills.includes(skill)}
                      data-testid={`button-add-popular-skill-${skill}`}
                    >
                      {skill}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Current Skills */}
              {skills.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Your Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                          data-testid={`button-remove-skill-${skill}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <FormLabel>Certifications</FormLabel>
              <div className="flex space-x-2 mt-2">
                <FormField
                  control={form.control}
                  name="certificationInput"
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        placeholder="Add a certification..."
                        {...field}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCertification(field.value || "");
                          }
                        }}
                        data-testid="input-certification"
                      />
                    </FormControl>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addCertification(form.getValues("certificationInput") || "")}
                  data-testid="button-add-certification"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Popular Certifications */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Popular DataBricks Certifications:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {popularCertifications.map((cert) => (
                    <Button
                      key={cert}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addCertification(cert)}
                      className="text-xs text-left justify-start h-auto p-2"
                      disabled={certifications.includes(cert)}
                      data-testid={`button-add-popular-cert-${cert}`}
                    >
                      {cert}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Current Certifications */}
              {certifications.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Your Certifications:</p>
                  <div className="space-y-2">
                    {certifications.map((cert) => (
                      <Badge key={cert} variant="outline" className="flex items-center justify-between w-full p-2">
                        <span className="text-xs">{cert}</span>
                        <button
                          type="button"
                          onClick={() => removeCertification(cert)}
                          className="ml-2 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                          data-testid={`button-remove-cert-${cert}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>External Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="portfolioUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio URL</FormLabel>
                  <FormControl>
                    <Input 
                      type="url"
                      placeholder="https://yourportfolio.com" 
                      {...field}
                      data-testid="input-portfolio-url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input 
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile" 
                      {...field}
                      data-testid="input-linkedin-url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input 
                      type="url"
                      placeholder="https://github.com/yourusername" 
                      {...field}
                      data-testid="input-github-url"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-profile">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} data-testid="button-save-profile">
            {isPending ? "Saving..." : profile ? "Update Profile" : "Create Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
