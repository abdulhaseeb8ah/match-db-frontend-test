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

// Job form validation schema
const jobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  location: z.string().optional(),
  type: z.string().optional(),
  experienceLevel: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
});

const formSchema = jobSchema.extend({
  skillInput: z.string().optional(),
  requirementInput: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface JobFormProps {
  job?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
  companies: any[];
}

export default function JobForm({ job, onSave, onCancel, isPending, companies }: JobFormProps) {
  const [skills, setSkills] = useState<string[]>(job?.skills || []);
  const [requirements, setRequirements] = useState<string[]>(job?.requirements || []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyId: job?.companyId || "",
      title: job?.title || "",
      description: job?.description || "",
      location: job?.location || "",
      type: job?.type || "full-time",
      experienceLevel: job?.experienceLevel || "",
      salaryMin: job?.salaryMin || 0,
      salaryMax: job?.salaryMax || 0,
      salaryType: job?.salaryType || "yearly",
      skillInput: "",
      requirementInput: "",
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

  const addRequirement = (requirement: string) => {
    if (requirement.trim() && !requirements.includes(requirement.trim())) {
      setRequirements([...requirements, requirement.trim()]);
      form.setValue("requirementInput", "");
    }
  };

  const removeRequirement = (requirement: string) => {
    setRequirements(requirements.filter(r => r !== requirement));
  };

  const onSubmit = (data: FormData) => {
    const { skillInput, requirementInput, ...jobData } = data;
    onSave({
      ...jobData,
      skills,
      requirements,
    });
  };

  const popularSkills = [
    "Apache Spark", "Delta Lake", "MLflow", "DataBricks SQL", "Python", "Scala", 
    "Unity Catalog", "Data Mesh", "Lakehouse", "Kubernetes", "Terraform", "Azure", "AWS"
  ];

  const commonRequirements = [
    "Bachelor's degree in Computer Science or related field",
    "3+ years of experience with DataBricks",
    "Strong experience with Apache Spark",
    "Experience with cloud platforms (AWS/Azure/GCP)",
    "Knowledge of data engineering best practices",
    "Experience with SQL and NoSQL databases",
    "Familiarity with CI/CD pipelines",
    "Strong problem-solving skills"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="companyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-company">
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. Senior DataBricks Engineer" 
                      {...field}
                      data-testid="input-job-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                      className="min-h-[150px]"
                      {...field}
                      data-testid="textarea-job-description"
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
                        data-testid="input-job-location"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-job-type">
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-experience-level">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="expert">Expert Level</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compensation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="salaryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-salary-type">
                        <SelectValue placeholder="Select salary type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="project">Project-based</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="salaryMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Salary</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="e.g. 120000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-salary-min"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salaryMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Salary</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="e.g. 180000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-salary-max"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements & Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <FormLabel>Required Skills</FormLabel>
              <div className="flex space-x-2 mt-2">
                <FormField
                  control={form.control}
                  name="skillInput"
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        placeholder="Add a required skill..."
                        {...field}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill(field.value || "");
                          }
                        }}
                        data-testid="input-add-skill"
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
                  <p className="text-sm font-medium mb-2">Required Skills:</p>
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
              <FormLabel>Job Requirements</FormLabel>
              <div className="flex space-x-2 mt-2">
                <FormField
                  control={form.control}
                  name="requirementInput"
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        placeholder="Add a job requirement..."
                        {...field}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addRequirement(field.value || "");
                          }
                        }}
                        data-testid="input-add-requirement"
                      />
                    </FormControl>
                  )}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addRequirement(form.getValues("requirementInput") || "")}
                  data-testid="button-add-requirement"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Common Requirements */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Common Requirements:</p>
                <div className="grid grid-cols-1 gap-2">
                  {commonRequirements.map((requirement) => (
                    <Button
                      key={requirement}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addRequirement(requirement)}
                      className="text-xs text-left justify-start h-auto p-2"
                      disabled={requirements.includes(requirement)}
                      data-testid={`button-add-common-req-${requirement}`}
                    >
                      {requirement}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Current Requirements */}
              {requirements.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Job Requirements:</p>
                  <div className="space-y-2">
                    {requirements.map((requirement, index) => (
                      <div key={requirement} className="flex items-center justify-between bg-gray-100/50 rounded-lg p-3">
                        <span className="text-sm flex-1">{requirement}</span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(requirement)}
                          className="ml-2 hover:bg-destructive hover:text-destructive-foreground rounded-full p-1"
                          data-testid={`button-remove-requirement-${index}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-job">
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} data-testid="button-save-job">
            {isPending ? "Saving..." : job ? "Update Job" : "Post Job"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
