import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Interview } from "@/types";

import { CustomBreadCrumb } from "./custom-bread-crumb";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Headings } from "./headings";
import { Button } from "./ui/button";
import { Loader, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { chatSession } from "@/scripts";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";

interface FormMockInterviewProps {
  initialData: Interview | null;
}

const formSchema = z.object({
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Description is required"),
  experience: z.coerce
    .number()
    .min(0, "Experience cannot be empty or negative"),
  techStack: z.string().min(1, "Tech stack must be at least a character"),
});

type FormData = z.infer<typeof formSchema>;

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  const { isValid, isSubmitting } = form.formState;
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const title = initialData
    ? initialData.position
    : "Create a new mock interview";

  const breadCrumpPage = initialData ? initialData?.position : "Create";
  const actions = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData
    ? { title: "Updated..!", description: "Changes saved successfully..." }
    : { title: "Created..!", description: "New Mock Interview created..." };

  const cleanAiResponse = (responseText: string) => {
    const tryParseArray = (value: string) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          throw new Error("AI response is not a JSON array");
        }
        return parsed;
      } catch (parseError) {
        throw parseError;
      }
    };

    const extractValidObjects = (jsonStr: string): any[] => {
      // Try to extract individual valid objects from the array
      const objects: any[] = [];
      let depth = 0;
      let inString = false;
      let escapeNext = false;
      let currentObject = "";
      let braceDepth = 0;
      
      for (let i = 0; i < jsonStr.length; i++) {
        const char = jsonStr[i];
        
        if (escapeNext) {
          escapeNext = false;
          currentObject += char;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          currentObject += char;
          continue;
        }
        
        if (char === '"' && !escapeNext) {
          inString = !inString;
          currentObject += char;
          continue;
        }
        
        if (inString) {
          currentObject += char;
          continue;
        }
        
        if (char === '[') {
          depth++;
          if (depth === 1) {
            // Start of array, reset
            currentObject = "";
            continue;
          }
        } else if (char === ']') {
          depth--;
          if (depth === 0 && currentObject.trim()) {
            // Try to parse the accumulated objects
            try {
              const arrayStr = "[" + currentObject + "]";
              const parsed = JSON.parse(arrayStr);
              if (Array.isArray(parsed)) {
                return parsed;
              }
            } catch {
              // Continue trying to extract individual objects
            }
          }
        } else if (char === '{') {
          braceDepth++;
          currentObject += char;
        } else if (char === '}') {
          braceDepth--;
          currentObject += char;
          
          // If we closed an object, try to parse it
          if (braceDepth === 0 && currentObject.trim()) {
            try {
              const objStr = currentObject.trim();
              // Remove trailing comma if exists
              const cleaned = objStr.replace(/,\s*$/, '');
              const parsed = JSON.parse(cleaned);
              if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                objects.push(parsed);
                currentObject = "";
                braceDepth = 0;
              }
            } catch {
              // Object is invalid, continue
              currentObject = "";
              braceDepth = 0;
            }
          } else {
            currentObject += char;
          }
        } else {
          currentObject += char;
        }
      }
      
      // If we have at least some valid objects, return them
      if (objects.length > 0) {
        return objects;
      }
      
      throw new Error("Could not extract valid objects from response");
    };

    const fixJsonSyntax = (jsonStr: string): string => {
      let fixed = jsonStr;
      let inString = false;
      let escapeNext = false;
      let result = "";
      
      // Process character by character to avoid modifying strings
      for (let i = 0; i < fixed.length; i++) {
        const char = fixed[i];
        const nextChar = fixed[i + 1];
        
        if (escapeNext) {
          escapeNext = false;
          result += char;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          result += char;
          continue;
        }
        
        if (char === '"') {
          inString = !inString;
          result += char;
          continue;
        }
        
        if (inString) {
          result += char;
          continue;
        }
        
        // Fix trailing commas before } or ]
        if (char === ',' && (nextChar === '}' || nextChar === ']')) {
          // Skip this comma
          continue;
        }
        
        // Fix missing commas between objects
        if (char === '}' && nextChar === '{') {
          result += '},';
          continue;
        }
        
        // Fix missing commas between array elements
        if (char === ']' && nextChar === '[') {
          result += '],';
          continue;
        }
        
        result += char;
      }
      
      return result;
    };

    let trimmed = responseText.trim();
    
    // Remove markdown code blocks
    trimmed = trimmed.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
    
    // Try direct parse first
    try {
      return tryParseArray(trimmed);
    } catch {
      // Try to extract JSON array from text
      const start = trimmed.indexOf("[");
      const end = trimmed.lastIndexOf("]");

      if (start === -1 || end === -1 || end <= start) {
        throw new Error("No JSON array found in response");
      }

      let candidate = trimmed.slice(start, end + 1);
      
      // Try parsing the extracted candidate
      try {
        return tryParseArray(candidate);
      } catch (error) {
        // Try to fix JSON syntax issues
        try {
          const fixed = fixJsonSyntax(candidate);
          return tryParseArray(fixed);
        } catch (fixError) {
          // Try to extract valid objects individually
          try {
            const validObjects = extractValidObjects(candidate);
            if (validObjects.length >= 3) {
              // If we got at least 3 valid objects, use them
              return validObjects;
            }
          } catch (extractError) {
            // Extraction failed, continue to next attempt
          }
          
          // Last resort: try to balance brackets and fix commas
          let fixedCandidate = candidate;
          fixedCandidate = fixJsonSyntax(fixedCandidate);
          
          const openBrackets = (fixedCandidate.match(/\[/g) || []).length;
          const closeBrackets = (fixedCandidate.match(/\]/g) || []).length;
          
          if (openBrackets > closeBrackets) {
            fixedCandidate += "]".repeat(openBrackets - closeBrackets);
          }
          
          try {
            return tryParseArray(fixedCandidate);
          } catch {
            throw new Error(
              `Failed to parse JSON response. The AI may have returned malformed JSON. Please try again. Original error: ${error instanceof Error ? error.message : "Unknown error"}`
            );
          }
        }
      }
    }
  };

  const generateAiResponse = async (data: FormData) => {
    const prompt = `You are a technical interview question generator. Generate exactly 5 interview questions as a valid JSON array.

CRITICAL REQUIREMENTS:
- Return ONLY a valid JSON array, nothing else
- No markdown, no code blocks, no explanations, no text before or after
- Each object must have exactly two fields: "question" and "answer"
- All quotes inside text must be escaped as \\"
- All newlines inside strings must be escaped as \\n
- No trailing commas
- Proper comma separation between objects
- Valid JSON syntax that can be parsed by JSON.parse()

Format:
[{"question":"Question 1","answer":"Answer 1"},{"question":"Question 2","answer":"Answer 2"},{"question":"Question 3","answer":"Answer 3"},{"question":"Question 4","answer":"Answer 4"},{"question":"Question 5","answer":"Answer 5"}]

Job Information:
- Position: ${data?.position}
- Description: ${data?.description}
- Experience Required: ${data?.experience} years
- Tech Stack: ${data?.techStack}

Generate questions that assess ${data?.techStack} skills, best practices, problem-solving, and handling complex requirements.

Return the JSON array now:`;

    const aiResult = await chatSession.sendMessage(prompt);
    const cleanedResponse = cleanAiResponse(aiResult.response.text());

    return cleanedResponse;
  };

  const onSubmit = async (data: FormData) => {
  try {
    setLoading(true);

    if (initialData) {
      // Update interview
      if (isValid) {
        const aiResult = await generateAiResponse(data);

        await updateDoc(doc(db, "interviews", initialData?.id), {
          questions: aiResult,
          ...data,
          updatedAt: serverTimestamp(),
        }).catch((error) => console.log(error));

        toast(toastMessage.title, {
          description: toastMessage.description,
        });
      }
    } else {
      // Create new interview
      if (isValid) {
        const aiResult = await generateAiResponse(data);

        await addDoc(collection(db, "interviews"), {
          ...data,
          userId,
          questions: aiResult,
          createdAt: serverTimestamp(),
        });

        toast(toastMessage.title, {
          description: toastMessage.description,
        });
      }
    }

    navigate("/generate", { replace: true });
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      if (error.name === "RateLimitError") {
        toast.error("Gemini limit reached", {
          description: "Bạn đã vượt giới hạn, thử lại sau ít phút nhé.",
        });
      } else if (error.name === "ClientThrottleError") {
        toast.warning("Chậm lại chút nhé", {
          description: "Bạn thao tác quá nhanh, đợi vài giây rồi thử lại.",
        });
      } else {
        toast.error("Error..", {
          description: "Something went wrong. Please try again later",
        });
      }
    }
  } finally {
    setLoading(false);
  }
  };


  const onDelete = async () => {
    if (!initialData) return;

    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, "interviews", initialData.id));
      toast.success("Deleted..!", {
        description: "Mock Interview deleted successfully.",
      });
      navigate("/generate", { replace: true });
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Error..", {
        description: "Failed to delete the interview. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        description: initialData.description,
        experience: initialData.experience,
        techStack: initialData.techStack,
      });
    }
  }, [initialData, form]);

  return (
    <div className="w-full flex-col space-y-4">
      <CustomBreadCrumb
        breadCrumbPage={breadCrumpPage}
        breadCrumpItems={[{ label: "Mock Interviews", link: "/generate" }]}
      />

      <div className="mt-4 flex items-center justify-between w-full">
        <Headings title={title} isSubHeading />

        {initialData && (
          <Button
            type="button"
            size={"icon"}
            variant={"ghost"}
            onClick={onDelete}
            disabled={loading || isDeleting}
          >
            {isDeleting ? (
              <Loader className="min-w-4 min-h-4 animate-spin" />
            ) : (
              <Trash2 className="min-w-4 min-h-4 text-red-500" />
            )}
          </Button>
        )}
      </div>

      <Separator className="my-4" />

      <div className="my-6"></div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-8 rounded-lg flex-col flex items-start justify-start gap-6 shadow-md "
        >
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Role / Job Position</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- Full Stack Developer"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Description</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- describle your job role"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Years of Experience</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- 5 Years"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Tech Stacks</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- React, Typescript..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-end gap-6">
            <Button
              type="reset"
              size={"sm"}
              variant={"outline"}
              disabled={isSubmitting || loading}
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              size={"sm"}
              disabled={isSubmitting || !isValid || loading}
            >
              {loading ? (
                <Loader className="text-gray-50 animate-spin" />
              ) : (
                actions
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
